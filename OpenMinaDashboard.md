# The Open Mina Interface

To gain a better understanding of the various processes happening in a Mina node and the Mina network as a whole, we have developed the Open Mina Dashboard. It is a browser-based interface that visualizes all of the data we have gained by tracing Mina nodes and their communication across the Mina network. 

Let’s take a closer look at the interface:

Open up the [Open Mina website](http://1.k8.openmina.com:31308/dashboard/nodes)


## Dashboard

We want to first take a look at all of the nodes on the Mina network to gain a high-level overview of their latencies and block application times. Please note that this shows nodes on the Mina testnet.

![1-0-Dashboard](https://user-images.githubusercontent.com/1679939/220898792-967416a7-3bfc-427c-95c6-f99a6b2b0553.png)

### Nodes 

This first opens up a list of synced nodes currently available (in the testnet).

In this screen, we can see that there are **8 Nodes** altogether. Among them are **5 Producers** of blocks, **8 Snarkers** (SNARK workers), **1 Seeder** and **0 Transaction Generators**. Note that some nodes fulfill more than one role, for instance,  in addition to producing SNARKs, a Snarker will perform the same role as a regular node.

We can select to **Show latency from fastest** and **Show latency from second fastest**. With this, you can choose from which point to measure latencies.

Showing latency from fastest shows the time when the block producer started producing a block, or block slot time. This equals block production time plus broadcasting latency. 

Showing latency from second fastest displays the time the block was already produced and reached the peer. This shows pure network latency.


![1-1-Dashboard Sidebar](https://user-images.githubusercontent.com/1679939/220898968-85c714b4-9049-41c7-96be-ee2e93659038.png)


Click on a node to open up a window with a list of checkpoints, as seen above. A checkpoint is a term we use to describe a place in the code (or the process which we are tracing) where we mark that we have reached that location.


![1-3-Dashboard Sidebar FocusedCheckpoints](https://user-images.githubusercontent.com/1679939/220899794-b099e2eb-61b0-4736-8dad-056fc41635d8.png)


At the top is the block hash (**3NKUYE...29CUrL**)

Immediately below the name are the options to either **Expand All** checkpoints, or **Collapse All**. Click on Expand All.

Checkpoints are sorted chronologically from top to bottom, meaning that each action is performed after the action above it. 

From left to right, each checkpoint describes:



* The name of the process. 
* The time at which the process started. This time is local to the user (the person viewing the tracing UI).
* How long it took to complete the process. This value is color-coded to reflect whether the process took longer than expected:
    * yellow is for durations over 100 ms
    * orange is for durations over 300 ms
    * red is for durations over 1 second.  


We are primarily interested in the checkpoints that are slower than usual, with the time under the **Process** column being in either orange or red numbers. To explain how this list of checkpoints helps us in code optimization, lets take a look at how we improved block application time.

When applying a block, when works are included, the biggest contributor to the time it takes to process the block is the `check completed works` step.

In the check completed works step, the node verifies the completed works included in the block (proofs for transactions included in previous blocks, that are waiting for their proofs to be included). When a block includes many proofs, this step can get expensive.

However, most of the time the completed work that needs to be verified has already been verified in the SNARK pool. 

This optimization takes advantage of that by comparing and filtering out all the completed works included in a block that are already present in the SNARK pool. As a result, the amount of work that needs to be verified is reduced (quite often to 0).

We then tested the optimization by running two servers extended with internal tracing here, one unpatched, and another one patched with this optimization.

For block 7881 on `berkeleynet`, which includes 76 completed works, here are the times for the unpatched and patched nodes:

**Unoptimized node (8.86s) / Block Total (12.03s)**


TBD <screenshot - unoptimized node>

**Optimized node (0.015s) / Block Total (1.5s)**

TBD <screenshot - optimized node>

By tracing these checkpoints, not only are we informed of particularly slow processes, but we can also confirm whether our implemented changes have resulted in better performance.

Now let’s move onto the **Explorer** section, which is located immediately below the Dashboard.


## Explorer

The Explorer page enables you to access blockchain data recorded in the form of blocks, transactions, the SNARK pool, scan state and SNARK traces. It provides a view into the current and past state of the blockchain and its focus is the blockchain itself

![2-0-Explorer Blocks](https://user-images.githubusercontent.com/1679939/220905530-87957444-a1c4-4582-9084-fef289b52b98.png)
  
### Blocks

This is the Mina block explorer, and the first tab displays a list of blocks sorted by the time of their publication (you can click on the **Date** column to switch between ascending and descending order).

Each block’s **Hash** is written next to the date, along with the block

**Height** (the level at which the block has been published), its **Global [Slot](https://docs.minaprotocol.com/glossary#slot)** (a slot irrespective of epochs), how many **User Commands** it has, the number of **Total Transactions** in that block, the number of **Snark Jobs**, its **[Staged Ledger](https://docs.minaprotocol.com/glossary#staged-ledger) Hash** and its **[Snarked Ledger](https://docs.minaprotocol.com/glossary#snarked-ledger) Hash**.

Next, click on the **Transactions** tab. 


### Transactions

If you have created transactions via the **Benchmarks** page of the Dashboard, they will show up here. 

![2-1-Explorer Transactions--Empty Filled](https://user-images.githubusercontent.com/1679939/220905605-8e65ba43-66ca-40dc-be7b-e01a993a6c8f.png)

Transactions are sorted by their **Transaction ID**. You can also see where they are arriving **From** as well as the destination **To** which they are heading, the **Amount** of funds in a transaction, its **Fee**, **[Nonce](https://docs.minaprotocol.com/glossary#nonce)**, the **Memo** (note) associated with it and its **Status**.

Next, click on the **Snark Pool** tab.


### Snark pool

On this tab, we can inspect the contents of the internal state of the node, specifically the node's SNARK pool.

![2-2-SnarkPool](https://user-images.githubusercontent.com/1679939/220905659-ef65b346-eecb-49a0-b5ae-34951a029a66.png)

The snark pool contains work completed by snark workers in the pool of the current node. Snark workers compress transactions via SNARKs, receiving compensation in MINA for their effort.

**Snark jobs** - units of work performed by SNARK workers

**Prover** - the identity of the node acting as a snark prover

**Fee** - the compensation received by the snark worker.

**Work Ids** - a unique number identifying the snark job. Most snark jobs are bundled in pairs, which is why they have two work ids.

Next, we look at the **Scan State** tab


### Scan State

Transactions in Mina require SNARK proofs in order to be validated. We want to take a closer look at this process, which is why we’ve created a visual representation of the _[scan state](https://docs.minaprotocol.com/node-operators/scan-state)_, a data structure that queues transactions requiring transaction SNARK proofs.

![2-3-ScanState](https://user-images.githubusercontent.com/1679939/220905867-6a7c4e74-5b54-4647-8bdd-ee9609a56467.png)

At each block height, there are operations requiring proofs such as transactions, snarks, user commands, fee transfers and so on. Scroll through the various block heights with the use of the buttons at the top of the screen, then scroll down to view the individual trees of operations at that height.

Each operation is represented by one of the following possible values:

**Todo** - A request to generate this operation’s SNARK proof has been made, but it has yet to be added.

**Done** - means the operation already has a SNARK proof. The operation has been waiting in the SNARK pool and it was selected by a block producer. 

**Empty** - A request to generate this operation’s SNARK proof hasn’t been made.

Click on **Center trees** to move the horizontal scrolling bar to the center of the tree.

Select **Highlight snarks** to highlight all proofs (SNARK jobs) that are waiting to be selected by block producers. Click on **Hide snarks** to remove these highlights.


### Snark Traces

It is assumed that SNARKs, due to their performance demands, present a performance bottleneck. In order to understand how we can increase throughput, we had to understand how exactly SNARKs are generated, which is why we began tracing them. 

![2-4-0-SnarkTraces](https://user-images.githubusercontent.com/1679939/220906352-5fe5909b-a13f-484a-a9f3-fe57aa15913e.png)
  
Here is a list of Snark traces that were produced within a certain time range. By default this shows **All** Snark traces made within the highlighted time range. You can click on the **Select** button to open up a drop-down list of snarkers (SNARK workers), selecting one or multiple  snarkers will filter out the list to only show snark jobs from them. 

The **Time range** can be customized by clicking on the **Select** button at the top of the list. If there is already a time range selected, click on the **time range** to adjust it.

![2-4-1-SnarkTraces--Time](https://user-images.githubusercontent.com/1679939/220906754-c8e1cff5-6780-4388-b79c-0920bd838e3e.png)

You can either choose to display recent Snark Traces (such as the past 1 minute, 5 minutes and so on) or from a specific time range that you can enter.

In the upper right corner of the screen is the total number of snark **workers **as well as the total number of snark **jobs**.

A snark job has the following values:

**Worker** - The ID of the Snark worker that created this snark job.

**Work IDs** - a unique number identifying the snark job. Most snark jobs are bundled in pairs, which is why they have two work ids.

**Kind** - The latest state for this job.

**Job Init** - When snark worker initiated request to get the job from the node.

**Job Received** - The time it took to receive a job after it was requested from the node.

**Proof Generated** - How long it took for the Snark proof to be generated after **Job Received**

**Proof Submitted** - How long it took to submit the Snark proof  after **Proof Generated**.

Clicking on a Snark job will open up a sidebar on the left with additional **Job Details**:

![2-4-2-SnarkTraces--Sidebar](https://user-images.githubusercontent.com/1679939/220906812-fc4734c4-db93-46d6-9738-501a3f6f6add.png)

To choose a **Time range**, click on the **Select** button, where you can either choose to display recent Snark Traces (such as the past 1 minute, 5 minutes and so on) or from a specific time range that you can enter.


## Resources

The node utilizes a variety of resources through processes such as reading, writing and communicating with peers. We want to have a graphical overview of how much resources are being used over time which helps us quickly detect possible problems or inefficiencies. 


### System

The **Resources** tab shows a graph representing the use of resources by the various nodes that are currently connected. Switch between the nodes by selecting from the clickable drop-down list located in the upper-right corner of the screen. Note that graphs for individual nodes will look very different due to varying lengths of time and varying uses of resources.

For each resource type, we can see various values. The node label represents the main Mina process. Total represents the sum of the main process’ value and all of the subprocesses. The subprocesses are labeled by their executors name and their respective PID (Process ID).

**coda-libp2p_hel-1806** is the subprocess that handles p2p communications. 

All the **exe** subprocesses are parallel workers launched by the main node process. 

The number and labels of the subprocesses can change as the node launches various subprocessses for tasks like proof production, proof verification, evaluation of verifiable random functions (VRFs), and so on. 


#### CPU

![3-0-1-Resources--CPU Default](https://user-images.githubusercontent.com/1679939/220909063-480d29b7-7742-49bd-8d88-e7e737332ff3.png)

From top to bottom, first, we see a graph of the node’s **CPU** usage. It describes the percentage of the CPU that was utilized by the processes over a period of time. 

Hovering over the timeline will bring up a graph with the following values:

**total** - total CPU usage, the sum of the main process (node) and all of its subprocesses.

**node** - CPU usage of the main process.

**coda-libp2p_hel-1806** - CPU usage of the process that handles P2P communication

**exe-1778** - CPU usage by a parallel worker launched by the main node process





Click on a point in the graph to show how much of that resource the various processes used, in percentages, at that point in time. 

![3-0-Resources--CPU](https://user-images.githubusercontent.com/1679939/220909204-367b80ae-578f-4964-b083-61b45329ad4b.png)

Clicking on a process, for instance on `coda-libp2p_hel-155`, will open up a detailed breakdown of resource use by the various threads running under that process. 

You can also open up this point in time in the **Network - Messages** and **Explorer - Snark traces** tabs. Doing will open up a new tab in your browser.


#### Memory

Describes how much physical memory (RAM) each process is using at given times. 

![3-1-Resources--Memory](https://user-images.githubusercontent.com/1679939/220909230-10c10ca6-bbbe-4ce8-8259-37be0ce993d1.png)

**total** - Total memory usage

**node** - Memory usage of the main process 

**coda-libp2p_hel-1806** - Memory usage of the process that handles P2P communication

**exe-1778** - Memory usage by a parallel worker launched by the main node process

**exe-1789** - Memory usage by a parallel worker launched by the main node process

**exe-1800** - Memory usage by a parallel worker launched by the main node process


#### Storage IO

![3-2-Resources--Storage](https://user-images.githubusercontent.com/1679939/220909283-509348fb-8482-407f-82d2-a136d0a43eee.png)

Displays the disk read and written bandwidth over a period of time. In other words, how much data was read/written from/to the disk (HDD/SSD) per second over a period of time. 

**total read** - Total disk read bandwidth

**total write** - Total disk written bandwidth

**node read** - Total node process read bandwidth

**node write** - Total node process write bandwidth

**coda-libp2p_hel-1806** **read** - read bandwidth of the process that handles P2P communication

**coda-libp2p_hel-1806** **write** - write bandwidth of the process that handles P2P communication

**exe-1778 read** - read bandwidth of a parallel worker launched by the main node process

**exe-1778 write** - write bandwidth of a parallel worker launched by the main node process


#### **Network IO**.

Displays the network sent and received bandwidth over a period of time. In other words, how much data was sent and received per second over a period of time. 
  
![3-3-Resources--NetworkIO](https://user-images.githubusercontent.com/1679939/220909309-91d322e0-e7b4-46ce-8603-cc7b0fe142c8.png)

**total received** - total received bandwidth

**total sent** - total sent bandwidth

**node received** - Total bandwidth received by the node process

**node sent** - Total bandwidth sent by the node process

**coda-libp2p_hel-1806 received** - bandwidth received by the process that handles P2P communication

**coda-libp2p_hel-1806 sent** - bandwidth sent by the process that handles P2P communication

**exe-1778 received** - bandwidth received by a parallel worker launched by the main node process

**exe-1778 sent** - bandwidth sent by a parallel worker launched by the main node process


## Network

The P2P network is the key component of the Mina blockchain. This is an overview of the messages sent by the node, other peer nodes connecting to it, as well as the blocks being propagated across the network. 


<screenshot - network - main>

The Network page has the following tabs: 



* **Messages** sent and received across the P2P network by this node 
* **Connections** with peers (incoming and outgoing)
* **Blocks** propagated across the P2P network
* **Blocks IPC** stands for inter-process communication between Mina peers as well as commands from Mina daemon on the same device.


### Messages

The **Messages** tab shows a list of all messages sent across the P2P network.



Click on the Filters icon:

<screenshot - network - messages - filter icon>

Various filters for P2P messages will be displayed:


<screenshot - network - messages - filters opened>


Hovering over each filter category or filter will display a tooltip with additional information.

Clicking on a filter will filter out all other messages, displaying only those that are related to that category:

<screenshot - network - messages - filter selected>


You can also click on a filter category (in this case, `/noise`), which may contain multiple filters:

<screenshot - network - messages - filter category selected>


There is also the option of combining multiple filters from various categories:

<screenshot - network - messages - multiple filters selected>



Below the filters is a list of network **Messages**. They are sorted by their message **ID** and **datetime**. You can also see their **Remote Address**, **Direction** (whether they are incoming or outgoing), their **Size**, their **Stream Kind** and **Message Kind**.

The most recent messages continuously appear at the bottom of the list as long as the green **Live** button on the bottom of the screen is selected. Click on **Pause** to stop the continuous addition of new messages. There are buttons for going to the top of the list as well as for browsing back and forth between pages.


<screenshot - Network - messages - time filter>

There is also a time filter. Click on the button to open up a window into which you can input your own time range, and the page will filter out network messages made within that time range.

Click on a network message to display further details:



<Network - messages - details sidebar - message>





**Message**

By default, the Info window will first display the contents of the **Message**. 

Click on **Expand all** to show full details of all values, and **Collapse all** to minimize them. You can **Copy** the information into your clipboard or **Save** it, either as a **JSON** file or as a **Bin**. You can also click on **Copy link** to copy the a web link for this message to your clipboard.



**Message hex**

This is the Hex value of the message. 

You can **Copy** the information into your clipboard or **Save** it, either as a JSON file or as a Bin. Click on **Copy link** to copy a link to the message to your clipboard.

<Network - messages - connection>

**Connection**

Same as with the Message Hex, you can **Copy** the information into your clipboard or **Save** it, either as a JSON file or as a Bin. Click on **Copy link** to copy the link to the message to your clipbaord.

Now let’s move onto the next tab in the Network page - **Connections**


### Connections

A list of connections to other peers in the Mina P2P network.

<screenshot - network - connections>

**Datetime** - when the connection was made. Click on the datetime to open up a window with additional Connection details.

**Remote Address** - the address of the peer. Clicking on the address will take you back to the Messages tab and filter out all messages from that peer.

**PID** - the process id given to applications by the operating system. It will most likely remain the same for all messages while the node is running, but it will change if the node crashes and is rebooted. 

**FD** - the messages’s TCP socket ID (a file descriptor, but it is used for items other than files). The fd is valid inside the process, another process may also have the same fd, but it is different socket. Similarly to pid, it is subject to change when the connection is closed or fails.

**Incoming** - This value informs us of who initiated the communication, if it is the selected node in the top right corner, it will be marked as _outgoing_. If it is a different node, then it is marked as _incoming_.

**Decrypted In** - the percentage of messages coming into the node that the debugger was able to decrypt

**Decrypted Out** - the percentage of messages coming from the node that the debugger was able to decrypt

Click on a connection’s datetime to open up the **Connection details** window on the right side of your screen:

<network - connections - connection details>

**connectionId** - the ID number of the connection

**date** - the time and date when the connection was made

**incoming** - whether it is an incoming or outgoing connection

**addr** - the remote address from where the connection is coming

**pid** - process ID, explained above.

**fd** - TCP socket ID, explained above.

**Stats_in** - accumulated statistics about incoming traffic

**Stats_out** - accumulated statistic about outgoing traffic

Click on **Expand all** to show full details of all values, and **Collapse all** to minimize them. You can **Copy** the information into your clipboard or **Save** it as a JSON file.


### Blocks

We want to understand how efficient inter-node communication is, so we created a page that provides an overview of blocks propagated across the Mina P2P network. Note that everything is from the perspective of the node selected in the top right corner of the screen.


<Screenshot - network - blocks>

You can browse back and forth through lists of blocks depending on their block **Height**, or move to the top (meaning the highest or most recent block height). Below the height scroller, you can see the **Block candidates** at the selected height, as well as their hashes. Click on a Block candidate to filter out messages broadcasting that block.

Block candidates are known as such because for each global slot, multiple nodes are vying for the opportunity to produce a block. These nodes do not know about the rights of each other until a new block appears. Multiple nodes may assume that they can produce a valid block and end up doing so, creating these block candidates, but ultimately, there is a clear rule to select only one block as the canonical one.

Click on the icon on the right edge of the screen to open up a window titled **Distributions** that displays a histogram with the distribution of times from the sample we collected. 

<screenshot - network - blocks - distributions>

This histogram lets you see how much variation there is between block send times, what is the range and what are the most common times.





### Blocks IPC

A Mina node communicates over the network with other peers as well as inter-process commands from Mina daemon on the same device. This screen is about inter-process communication (IPC). It allows the user to track the block as it is being created by the local node or as it is first seen by the local node.


<screenshot - network - blocks IPC>

**Height** - the block height at which the candidate blocks are attempting to be published. 

**Block candidates** - blocks that have been created as candidate blocks for that block height, but have yet to be selected as canonical.

**Datetime** - The time and date when they were added

**Message Hash** - A hash calculated for each message that helps detect duplicates.

**Height** - the height of the blocks

**Node Address** - address of the node that the debugger is attached to.

**Peer Address** - if this value is `received_gossip`, it means the peer sent us the message.  If it is `publish_gossip`, then this field is absent, because it was published to all peers.

**Type** - the type of event, either `received_gossip` or `publish_gossip`.

**Message Type** - The three possible messages Mina can broadcast are `new_state`, `snark_pool_diff` or `transaction_pool_diff`.

**Block Latency** - the time between the creation of this block and when this block has been seen by the peer

Click on the icon on the right edge of the screen to open up a window titled **Distributions** that displays a graph with block count on the y-axis and Block Latency values on the x-axis.


## Tracing



<Screenshot - Tracing - overview>

The Tracing Dashboard is an overview of calls made from various checkpoints within the Mina code. It informs us which processes are particularly slow, which indicates what parts of the code are in most need of optimization. 

The first screen is the **Overview** tab in which you can see a visualization of the metrics for various checkpoints, represented by graphs.


### Overview

By default, the graphs are sorted **Slowest first** since we are most interested in particularly slow processes. You can click on **Fastest first** to sort in the reverse order.

Let’s take a closer look at a checkpoint graph:


<Tracing - overview - checkpoints>

At the top, we have the name for the checkpoint (**Initial validation**).

Below the name is the total time of all calls made from that checkpoint (**852.23s**), as well as the number of calls made (**1k calls**). Whenever the node reaches the `Initial validation` checkpoint, it will make a call to the dashboard.

The y axis represents the total time of all calls made after reaching that checkpoint.

The x axis represents the duration of calls made after reaching that checkpoint.

<Tracing - graph hover - tooltip>

Hovering the cursor above a vertical row displays a tooltip that shows:



* How many calls were made within that **Range**
* Their **Mean** (average) duration
* The **Max** duration of a call within that range
* How many **Calls** were made 
* The cumulative **Total Time** of these calls

Squares marked with gray edges denote that the calls have an adequate duration. Yellow edges signify that the calls take slightly longer than usual, orange edges are for calls that are longer than usual, and red squares denote that the duration is too long and that the code near this checkpoint should be optimized.

We can also display the overview tab in compact mode, to get a clearer picture of which checkpoint calls are particularly slow. 


<Tracing - overview - minimized view>

Clicking on a checkpoint call will expand it and reveal the full graph:


<Tracing - overview - minimized - click on graph>

Now switch to the **Blocks** tab located on the right of the Overview tab.


<Tracing - blocks>

A list of blocks will appear, sorted by their block **height**. This is a number that designates their level on the blockchain, - the genesis block has a block height of 0, and each block built on top of it increments this height by 1. The higher the number, the more recently has the block been published, therefore the blocks are also listed in reverse chronological order (newest at top).

Note that multiple blocks may have the same block height: 

<screenshot - tracing - blocks - multiple blocks at same height>

In Mina, multiple block producers can get the right to publish the block at the same time. Therefore there can be multiple valid blocks at the same height. This, of course, causes a problem - if there are multiple valid blocks at the same level, the node must figure out which one is the _canonical_ block and will have another block published on top of it, thus becoming a continuation of the Mina blockchain.

Part of the Mina consensus algorithm is a series of mechanisms that determine which block will be the canonical block.

First, the node attempts to select the longest chain, which works if the forks are short-range. If blocks are based on the same parent, VRF hashes are compared, with the larger one being preferred. If VRF hashes are equal, then we compare state hashes as a tie-breaker.


<diagram - tree of blocks, multiple blocks at same height, canonical chain green>

See the diagram above for a visual explanation. While there are two blocks at level 2, we already know that the one on the right is the canonical block (in green), because an additional block or blocks are published on top of it. However, we haven’t determined which of the level 3 blocks are canonical, because no blocks have been published at level 4.

**Source and Status**

In the same window, on the right side of the screen, the **source** of each block and its **status** is displayed. 

<Tracing - blocks - source and status>


A block may have various sources:



* **External**, which means it was produced by other nodes within the network and received via the gossip network.
* **Internal** is for internally produced blocks, i.e. published by the user’s own node.
* **Reconstruct** means your node has already received the data for these blocks, but because the node was reset, it needs to _reconstruct_ the blocks using the data in its cache.
* **Catchup** designates blocks that your node has requested from other nodes in the network via RPC in order to ‘catch up’ with the rest of the network.

Status can either be determined as a **success**, a **failure** or **pending**.

**Block details**

Clicking on a block will expand a window on the right side of the screen with additional details:

<Tracing - blocks - block details>

At the top of the window, the title describes the source of the block (External), its number and its status (Success).

Below that, we have several checkpoints for the various calls a block must go through before it is published. 



## Benchmarks

We want to be able to benchmark test the Mina network in order to measure its capabilities. For that purpose, we’ve developed a Benchmark frontend through which users can mass send transactions.


### Wallets


<Screenshot - Benchmarks - default screen>

The benchmarks page shows a list of testnet wallets from which we send transactions to the node. You can send any number of transactions, though the maximum number of transactions that can be sent at a time is based on how many wallets are available. For instance, if you want to send 300 transactions, and 200 wallets are available, you must press the **Send** button twice.

There are two options for where to send transactions from

<Screenshot - Benchmarks - random sender>

* From **Random** **senders**, which are chosen randomly from wallets from the list (1 wallet can be only once a sender in a batch sending process)

<screenshot - benchmarks - send from specific sender>


* All sent from the same **Specific sender** wallet, which can be chosen from a dropdown menu.

After you’ve mass sent transactions, you can see many transactions have been a **success** and how many **failed** in the upper right corner.



