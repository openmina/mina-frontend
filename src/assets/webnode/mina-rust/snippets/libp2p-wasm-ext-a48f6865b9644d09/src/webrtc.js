// Copyright 2020 Parity Technologies (UK) Ltd.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

const CHANNEL_NAME = "data";

function httpSend(opts) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) {
                return;
            }
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    body: xhr.response,
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        if (opts.headers) {
            Object.keys(opts.headers).forEach(function (key) {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }
        var params = opts.params;
        // We'll need to stringify if we've been given an object
        // If we have a string, this is skipped.
        if (params && typeof params === 'object') {
            params = Object.keys(params).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }
        xhr.send(params);
    });
}

export const webrtc_transport = async (crypto) => {
    // Connections that we get using other method than just dialing
    // peers and signaling using http server. Such method could be
    // manual signaling, when user exchanges sdp messages manually.
    const listenerEvents = async_queue();
    let listen_addr;

    const push_new_connection = (conn, stream, maAddr) => {
        const remote_candidate = conn.sctp.transport.iceTransport.getSelectedCandidatePair().remote;
        // const remote_addr = `/dns4/${remote_candidate.address}/udp/${remote_candidate.port}`;
        const event = { new_connections: [{
            connection: stream,
            observed_addr: maAddr || "",
            // observed_addr: remote_addr,
            local_addr: listen_addr,
        }] };
        listenerEvents.push(event);
    };

    const cert = await RTCPeerConnection.generateCertificate({
        name: "ECDSA",
        namedCurve: "P-256",
    });
    return {
        crypto,
        conn_config: {
            certificates: [cert],
          iceServers: [
            { urls: "stun:138.201.74.177:3478", username: "openmina", credential: "webrtc" },
            { urls: "stun:65.109.110.75:3478", username: "openmina", credential: "webrtc" },
            { urls: "turn:138.201.74.177:3478", username: "openmina", credential: "webrtc" },
            { urls: "turn:65.109.110.75:3478", username: "openmina", credential: "webrtc" },
          ],
        },

        signSignal(signal) {
            let signalConcat = signalAsSignInput(signal);
            return bs58btc.encode(this.crypto.sign(signalConcat));
        },
        createConn() {
            return new RTCPeerConnection(this.conn_config);
        },
        createConnWithChannel() {
            const conn = this.createConn();
            const channel = conn.createDataChannel(CHANNEL_NAME, {
              ordered: true,
            });
            return [conn, channel];
        },
        waitForIceGatheringComplete(conn) {
            if (conn.iceGatheringState == 'complete') {
                return Promise.resolve();
            }
            return new Promise((resolve) => conn.onicegatheringstatechange = () => {
                if (conn.iceGatheringState == 'complete') {
                    resolve();
                }
            });
        },
        async createAndSetOffer(conn, target_peer_id) {
            let offer = await conn.createOffer();
            await conn.setLocalDescription(offer);
            await this.waitForIceGatheringComplete(conn);
            offer = conn.localDescription;
            offer = {
                type: offer.type,
                sdp: offer.sdp,
                identity_pub_key: bs58btc.encode(this.crypto.pub_key_as_protobuf()),
                target_peer_id,
            };
            offer.signature = this.signSignal(offer);
            return offer;
        },
        async createAndSetAnswer(conn, target_peer_id) {
            let answer = await conn.createAnswer();
            await conn.setLocalDescription(answer);
            await this.waitForIceGatheringComplete(conn);
            answer = conn.localDescription;
            answer = {
                type: answer.type,
                sdp: answer.sdp,
                identity_pub_key: bs58btc.encode(this.crypto.pub_key_as_protobuf()),
                target_peer_id,
            };
            answer.signature = this.signSignal(answer);
            return answer;
        },
        /// Throws error if invalid.
        verifyRemoteSignal(signal, expected_peer_id) {
            if (signal.target_peer_id != this.crypto.peer_id_as_b58()) {
                throw "Identity handshake failed! Reason: `target_peer_id` in the WebRTC answer, doesn't match with the expected local peer id.";
            }
            let pub_key_as_protobuf = bs58btc.decode(signal.identity_pub_key);
            let data = signalAsSignInput(signal);
            let signature = bs58btc.decode(signal.signature);
            this.crypto.assert_signature(pub_key_as_protobuf, data, signature);
            let peer_id = this.crypto.pub_key_as_protobuf_to_peer_id_as_b58(pub_key_as_protobuf);
            if (peer_id != expected_peer_id) {
                throw "Identity handshake failed! Peer's ID doesn't match the expected one."
            }
        },

        manual_connector() {
            return {
                dial: async (target_peer_id) => {
                    const [conn, channel] = this.createConnWithChannel();
                    const offer = await this.createAndSetOffer(conn, target_peer_id);
                    console.info(`[Libp2p][WebRTC][Manual][peer_${target_peer_id}] send offer`, offer);

                    return {
                        offer: () => offer,
                        finish: async (answer) => {
                            console.info(`[Libp2p][WebRTC][Manual][peer_${target_peer_id}] recv answer`, offer);
                            const remote_pub_key_as_protobuf = bs58btc.decode(answer.identity_pub_key);
                            try {
                                this.verifyRemoteSignal(answer, target_peer_id);
                            } catch (e) {
                                console.error(`[Libp2p][WebRTC][Manual][peer_${target_peer_id}] verify answer error: `, e, answer);
                                throw e;
                            }

                            try {
                                await conn.setRemoteDescription(new RTCSessionDescription(answer));
                            } catch(e) {
                                console.error(`[Libp2p][WebRTC][Manual][peer_${target_peer_id}] setRemoteDescription error: `, e, answer);
                                throw e;
                            }
                            console.debug("[Libp2p][WebRTC][Manual] setRemoteDescription done:", answer);

                            const stream = await wait_channel_open_and_attach_handlers(conn, channel, target_peer_id, remote_pub_key_as_protobuf);
                            const ma_addr = `/p2p-webrtc-direct/p2p/${target_peer_id}`;
                            push_new_connection(conn, stream, ma_addr);
                        },
                    };
                },
                listen: () => {
                    let conn, finishedPromise, target_peer_id, remote_pub_key_as_protobuf;
                    return {
                        peer_id: () => this.crypto.peer_id_as_b58(),
                        set_offer_and_generate_answer: async (offer) => {
                            console.info("[Libp2p][WebRTC][Manual] recv offer:", offer);
                            remote_pub_key_as_protobuf = bs58btc.decode(offer.identity_pub_key);
                            target_peer_id = this.crypto.pub_key_as_protobuf_to_peer_id_as_b58(remote_pub_key_as_protobuf);
                            try {
                                this.verifyRemoteSignal(offer, target_peer_id);
                            } catch (e) {
                                console.error("[Libp2p][WebRTC][Manual] verify offer error:", e);
                                throw e;
                            }

                            conn = this.createConn();
                            const channelPromise = new Promise((resolve) => {
                                conn.ondatachannel = (e) => resolve(e.channel || e);
                            });
                            finishedPromise = channelPromise.then(async (channel) => {
                                const stream = await wait_channel_open_and_attach_handlers(conn, channel, target_peer_id, remote_pub_key_as_protobuf);
                                push_new_connection(conn, stream);
                            });
                            try {
                                await conn.setRemoteDescription(new RTCSessionDescription(offer));
                            } catch(e) {
                                console.error("[Libp2p][WebRTC][Manual] setRemoteDescription error:", e);
                                throw e;
                            }
                            return await this.createAndSetAnswer(conn, target_peer_id);
                        },
                        finish: async () => finishedPromise,
                    };
                },
            };
        },
        dial(addr) { return dial(this, addr); },
        listen_on(addr) {
            listen_addr = addr;
            listenerEvents.push({ new_addrs: [addr] });
            return (function* () {
                while (true) {
                    yield listenerEvents.next().then((ev) => {
                        console.log("[Libp2p][WebRTC][ListenerEvent]: ", ev)
                        return ev;
                    });
                }
            })();
        },
    };
}

function signalAsSignInput(signal) {
    return new TextEncoder().encode(`${signal.type}${signal.sdp}${signal.identity_pub_key}${signal.target_peer_id}`);
}

function closeConn(conn, channel = null) {
    // Check to see if the counter has been initialized
    if (typeof closeConn.counter == 'undefined') {
        // It has not... perform the initialization
        closeConn.counter = 0;
    }
    closeConn.counter++;
    setTimeout(() => {
        try {
            if (channel != null) {
              channel.close()
            }
            conn.close();
        } catch {}
    }, 20);
    // https://bugs.chromium.org/p/chromium/issues/detail?id=825576
    // workaround: https://stackoverflow.com/questions/66546934/how-to-clear-closed-rtcpeerconnection-with-workaround
    if (closeConn.counter % 4 == 0) {
        queueMicrotask(() => {
          console.warn("[Libp2p][WebRTC] doing heavy (around 50ms) GC for dangling peer connections");
          let img = document.createElement("img");
          img.src = window.URL.createObjectURL(new Blob([new ArrayBuffer(5e+7)])); // 50Mo or less or more depending as you wish to force/invoke GC cycle run
          img.onerror = function() {
            window.URL.revokeObjectURL(this.src);
            img = null
          }
        });
    }
}

// Attempt to dial a multiaddress.
const dial = async (self, addr) => {
    const addrParsed = addr.match(/^\/(ip4|ip6|dns4|dns6|dns)\/(.*?)\/tcp\/([0-9]+)\/http\/p2p-webrtc-direct\/p2p\/([a-zA-Z0-9]+)$/);
    console.info("[Libp2p][WebRTC] dial:", addr);
    if (addrParsed == null) {
        let err = new Error("Address not supported: " + addr);
        err.name = "NotSupportedError";
        throw err;
    }
    const target_peer_id = addrParsed[4];
    const [conn, channel] = self.createConnWithChannel();

    try {
        const offer = await self.createAndSetOffer(conn, target_peer_id);

        console.info("[Libp2p][WebRTC] send offer:", offer);
        const offerBase58 = bs58btc.encode(new TextEncoder().encode(JSON.stringify(offer)));
        const httpPrefix = String(addrParsed[3]).startsWith("443") ? "https://" : "http://";
        const respBody = await httpSend({
            method: "GET",
            url: httpPrefix + addrParsed[2] + ":" + addrParsed[3] + "/?signal=" + offerBase58,
        });
        const answer = JSON.parse(new TextDecoder().decode(bs58btc.decode(respBody)));
        console.info("[Libp2p][WebRTC] recv answer:", answer);
        let remote_pub_key_as_protobuf = bs58btc.decode(answer.identity_pub_key);
        try {
            self.verifyRemoteSignal(answer, target_peer_id);
        } catch (e) {
            console.error("[Libp2p][WebRTC] verify answer error:", e, answer);
            throw e;
        }

        try {
            await conn.setRemoteDescription(new RTCSessionDescription(answer));
        } catch(e) {
            console.error("[Libp2p][WebRTC] setRemoteDescription error:", error);
            throw e;
        }
        console.debug("[Libp2p][WebRTC] setRemoteDescription done:", answer);

        return wait_channel_open_and_attach_handlers(conn, channel, target_peer_id, remote_pub_key_as_protobuf);
    } catch (e) {
        closeConn(conn, channel);
        throw e;
    }
}

function try_bytes_as_str(bytes) {
    try {
        return new TextDecoder().decode(bytes);
    } catch {
        return "<bytes_as_str failed>";
    }
}

function wait_channel_open_and_attach_handlers(conn, channel, remote_id, remote_pub_key_as_protobuf) {
    return new Promise((open_resolve, open_reject) => {
        let reader = async_queue();
        channel.onerror = (ev) => {
            console.error(`[Libp2p][WebRTC][peer_${remote_id}][chan_${CHANNEL_NAME}][error]`, 'event:', ev);
            closeConn(conn, channel);
            // If `open_resolve` has been called earlier, calling `open_reject` seems to be
            // silently ignored. It is easier to unconditionally call `open_reject` rather than
            // check in which state the connection is, which would be error-prone.
            open_reject(ev);
            // Injecting an EOF is how we report to the reading side that the connection has been
            // closed. Injecting multiple EOFs is harmless.
            reader.push_eof();
        };
        channel.onclose = (ev) => {
            console.warn(`[Libp2p][WebRTC][peer_${remote_id}][chan_${CHANNEL_NAME}][closed]`, 'event:', ev);
            closeConn(conn, channel);
            // Same remarks as above.
            open_reject(ev);
            reader.push_eof();
        };
        conn.onconnectionstatechange = () => {
            if (conn.connectionState == "disconnected") {
                closeConn(conn, channel);
                // Same remarks as above.
                open_reject();
                reader.push_eof();
            }
        };

        // We inject all incoming messages into the queue unconditionally. The caller isn't
        // supposed to access this queue unless the connection is open.
        channel.onmessage = (ev) => {
            let data = ev.data;
            if (data instanceof Blob) {
                data = data.arrayBuffer();
            }
            data = Promise.resolve(data);
            // data.then(data => console.debug(`[Libp2p][WebRTC][peer_${remote_id}][chan_${CHANNEL_NAME}][msg_recv]`, 'bytes:', data, '\nas_str:', try_bytes_as_str(data)));
            reader.push(data);
        }

        channel.onopen = () => {
            console.info(`[Libp2p][WebRTC][peer_${remote_id}][chan_${CHANNEL_NAME}][opened]`);
            open_resolve({
                read: (function*() { while(channel.readyState == "open") {
                    let next = reader.next();
                    // Promise.resolve(next).then(next => console.debug(`[Libp2p][WebRTC][peer_${remote_id}][chan_${CHANNEL_NAME}][read]`, 'bytes:', next, '\nas_str:', try_bytes_as_str(next)));
                    yield next;
                } })(),
                write: (data) => {
                    if (channel.readyState == "open") {
                        // The passed in `data` is an `ArrayBufferView` [0]. If the
                        // underlying typed array is a `SharedArrayBuffer` (when
                        // using WASM threads, so multiple web workers sharing
                        // memory) the WebSocket's `send` method errors [1][2][3].
                        // This limitation will probably be lifted in the future,
                        // but for now we have to make a copy here ..
                        //
                        // [0]: https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView
                        // [1]: https://chromium.googlesource.com/chromium/src/+/1438f63f369fed3766fa5031e7a252c986c69be6%5E%21/
                        // [2]: https://bugreports.qt.io/browse/QTBUG-78078
                        // [3]: https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/bindings/IDLExtendedAttributes.md#AllowShared_p
                        // console.debug(`[Libp2p][WebRTC][peer_${remote_id}][chan_${CHANNEL_NAME}][write]`, 'bytes:', data, '\nas_str:', try_bytes_as_str(data));
                        channel.send(data.slice(0));
                        return promise_when_send_finished(channel);
                    } else {
                        return Promise.reject("WebRTC DataChannel is " + channel.readyState);
                    }
                },
                remote_pub_key: () => {
                    return remote_pub_key_as_protobuf;
                    // const cert = conn.sctp.transport.getRemoteCertificates()[0];
                    // if (!cert) {
                    //     return null;
                    // }
                    // return new Uint8Array(cert);
                },
                shutdown: () => closeConn(conn, channel),
                close: () => {}
            });
        }
	});
}

// Takes a WebSocket object and returns a Promise that resolves when bufferedAmount is low enough
// to allow more data to be sent.
const promise_when_send_finished = (channel) => {
	return new Promise((resolve, reject) => {
		function check() {
			if (channel.readyState != "open") {
				reject("WebRTC DataChannel is " + channel.readyState);
				return;
			}

			// We put an arbitrary threshold of 8 kiB of buffered data.
			if (channel.bufferedAmount < 8 * 1024) {
				resolve();
			} else {
				setTimeout(check, 100);
			}
		}

		check();
	})
}

// Creates a async queue.
const async_queue = () => {
	// State of the queue.
	let state = {
		queue: new Array(),
		// If `resolve` isn't null, it is a "resolve" function of a promise that has already been
		// returned by `next`. It should be called with some data.
		resolve: null,
	};

	return {
		// Inserts a new Blob in the queue.
		push: (buffer) => {
			if (state.resolve != null) {
				state.resolve(buffer);
				state.resolve = null;
			} else {
				state.queue.push(Promise.resolve(buffer));
			}
		},

		// Inserts an EOF message in the queue.
		push_eof: () => {
			if (state.resolve != null) {
				state.resolve(null);
				state.resolve = null;
			} else {
				state.queue.push(Promise.resolve(null));
			}
		},

		// Returns a Promise that yields the next entry as an ArrayBuffer.
		next: () => {
			if (state.queue.length != 0) {
				return state.queue.shift(0);
			} else {
				if (state.resolve !== null)
					throw "Internal error: already have a pending promise";
				return new Promise((resolve, reject) => {
					state.resolve = resolve;
				});
			}
		}
	};
};
