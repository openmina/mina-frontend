export interface SnarkWorkerTraceJob {
  worker: string;
  id: number;
  ids: string;
  kind: string;
  jobReceived: number;
  proofGenerated: number;
  proofSubmitted: number;

  jobInit: number;
  jobGetNodeReceived: number;
  jobGetNodeRequestWorkInit: number;
  jobGetNodeRequestWorkSuccess: number;
  jobGetSuccess: number;

  workCreateSuccess: number;
  workSubmitNodeReceived: number;
  workSubmitNodeAddWorkInit: number;
  workSubmitNodeAddWorkSuccess: number;
  workSubmitSuccess: number;
}
