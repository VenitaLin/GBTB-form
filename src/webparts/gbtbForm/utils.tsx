import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

export async function postData(
  client: SPHttpClient,
  url: string,
  sppayload: any
): Promise<any> {
  const spOpts: ISPHttpClientOptions = {
    body: sppayload,
  };
  let resp: SPHttpClientResponse = await client.post(
    url,
    SPHttpClient.configurations.v1,
    spOpts
  );
  return resp;
}

export async function getData(
  client: SPHttpClient,
  url: string,
  sppayload: any
): Promise<any> {
  const spOpts: ISPHttpClientOptions = {
    body: sppayload,
  };
  let resp: SPHttpClientResponse = await client.get(
    url,
    SPHttpClient.configurations.v1,
    spOpts
  );
  return resp;
}