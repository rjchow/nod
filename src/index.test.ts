import { getDocumentStoreRecords, parseDnsResults } from "./index";

const sampleDnsTextRecord = {
  type: "openatts",
  net: "ethereum",
  netId: "3",
  addr: "0x2f60375e8144e16Adf1979936301D8341D58C36C"
};

describe("getCertStoreRecords", () => {
  const sampleDnsTextRecordWithDnssec = {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    dnssec: false,
    addr: "0x2f60375e8144e16Adf1979936301D8341D58C36C"
  };
  test("it should work", async () => {
    expect(await getDocumentStoreRecords("example.openattestation.com")).toStrictEqual([sampleDnsTextRecordWithDnssec]);
  });

  test("it should return an empty array if there is no openatts record", async () => {
    expect(await getDocumentStoreRecords("google.com")).toStrictEqual([]);
  });

  test("it should return an empty array with a non-existent domain", async () => {
    expect(await getDocumentStoreRecords("thisdoesnotexist.gov.sg")).toStrictEqual([]);
  });
});

describe("parseDnsResults", () => {
  test("it should return one record in an array if there is one openatts record", () => {
    const sampleRecord = [
      {
        name: "example.openattestation.com.",
        type: 16,
        TTL: 110,
        data: '"openatts net=ethereum netId=3 addr=0x2f60375e8144e16Adf1979936301D8341D58C36C"'
      }
    ];
    expect(parseDnsResults(sampleRecord)).toStrictEqual([sampleDnsTextRecord]);
  });
  test("it should not mangle records with = in it", () => {
    const sampleRecord = [
      {
        name: "example.openattestation.com.",
        type: 16,
        TTL: 110,
        data: '"openatts net=ethereum=classic netId=3 addr=0x2f60375e8144e16Adf1979936301D8341D58C36C"'
      }
    ];
    expect(parseDnsResults(sampleRecord)).toStrictEqual([
      {
        type: "openatts",
        net: "ethereum=classic",
        netId: "3",
        addr: "0x2f60375e8144e16Adf1979936301D8341D58C36C"
      }
    ]);
  });
  test("it should return two record items if there are two openatts record", () => {
    const sampleRecord = [
      {
        name: "example.openattestation.com.",
        type: 16,
        TTL: 110,
        data: '"openatts net=ethereum netId=3 addr=0x2f60375e8144e16Adf1979936301D8341D58C36C"'
      },
      {
        name: "example.openattestation.com.",
        type: 16,
        TTL: 110,
        data: '"openatts net=ethereum netId=1 addr=0x007d40224f6562461633ccfbaffd359ebb2fc9ba"'
      }
    ];

    expect(parseDnsResults(sampleRecord)).toStrictEqual([
      {
        addr: "0x2f60375e8144e16Adf1979936301D8341D58C36C",
        net: "ethereum",
        netId: "3",
        type: "openatts"
      },
      {
        addr: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
        net: "ethereum",
        netId: "1",
        type: "openatts"
      }
    ]);
  });
});