import { Component, OnInit } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  response: any;
  GET_MY_TODOS = `
 TestQuery { account(publicKey: "B62qqXi8mm3UsY45DJFpEc6KK4k69hcVmWf6xm4FRYcuUKXUGW2BGit") {
    balance {
      blockHeight
      liquid
      locked
      stateHash
      total
      unknown
    }
    delegate
    isDisabled
    stakingActive
  }
  ownedWallets {
    nonce
    inferredNonce
    receiptChainHash
    delegate
    votingFor
    locked
    isTokenOwner
    isDisabled
    index
    zkappUri
    tokenSymbol
    leafHash
  }
}
`;

  constructor(private graphQL: GraphQLService) { }

  ngOnInit() {
    this.graphQL.query('TestQuery', this.GET_MY_TODOS)
      .subscribe((response) => {
        this.response = response;
      });
  }
}
