import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// import { Field, method, SmartContract, State, state } from 'snarkyjs';
//
// class Square extends SmartContract {
//   @state(Field) num = State<Field>();
//
//   override init() {
//     super.init();
//     this.num.set(Field(3));
//   }
//
//   @method update(square: Field) {
//     const currentState = this.num.get();
//     this.num.assertEquals(currentState);
//     square.assertEquals(currentState.mul(currentState));
//     this.num.set(square);
//   }
// }

@Component({
  selector: 'mina-zk-app',
  templateUrl: './zk-app.component.html',
  styleUrls: ['./zk-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class ZkAppComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.runZkApp();
  }

  async runZkApp() {
    // setTimeout(async () => {
    //   await isReady;
    //   console.log('SnarkyJS loaded');
    //   const useProof = false;
    //   const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
    //   Mina.setActiveInstance(Local);
    //   const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
    //   const { privateKey: senderKey, publicKey: senderAccount } = Local.testAccounts[1];
    //   console.log('Shutting down');
    //   await shutdown();
    // }, 5000);
  }
}
