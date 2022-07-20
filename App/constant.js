export const systemUserId = "6267b432caee8667beba56f5";

export const token =
  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXN0TmFtZSI6IlBhdGVsIiwiZG9tYWluU3NpZCI6IjIwODk5MSIsImdlbmRlciI6Ik1hbGUiLCJ1c2VyX25hbWUiOiI2MjY3YjQzMmNhZWU4NjY3YmViYTU2ZjUiLCJpbmNvZ25pdG8iOmZhbHNlLCJtY2MiOiIrMjY3IiwidHlwZSI6IkNVU1RPTUVSIiwibG9jYWxlIjoiZW5nIiwiY2xpZW50X2lkIjoiaXRwbCIsImV4dGVybmFsUmVmZXJlbmNlSWQiOiI2MjY3YjQzMjk2ZWNmMzExZGQ4YmZjN2EiLCJzY29wZSI6WyJSZWFkIiwiV3JpdGUiXSwiYXZ0YXJJbWFnZVVybCI6IjYyNjdiNDRkNGQyZjRhN2UzYWU5MDNiMSIsImlkIjoiNjI2N2I0MzJjYWVlODY2N2JlYmE1NmY1IiwiZXhwIjoxNjYwODYyNTAwLCJqdGkiOiI1YWQ0OGFjNS0wOTlmLTRhMjAtODgzMS05NzU1MGU5YmNmYTkiLCJlbWFpbCI6InNqcGF0ZWxAZ21haWwuY29tIiwiR3JhbnRlZC1BdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9DVVNUT01FUiJ9XSwidGltZVpvbmVJZCI6IkdNVCIsIm1vYmlsZSI6Ijk4OTg5OCIsImV4dGVybmFsU3lzdGVtQ29kZSI6bnVsbCwidXNlck5hbWUiOiJzanBhdGVsIiwiYmlydGhEYXRlIjoiMjAwOS00LTI2IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJmaXJzdE5hbWUiOiJTYW1hcnRoIiwiZXh0ZXJuYWxVc2VySWQiOm51bGwsImRvbWFpbiI6IjIwODk5MSIsInJlYWxtIjoiYmFuamVlIiwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoic2pwYXRlbCJ9.ATcIb-4lV3yQA5OIc700enbpAk5BoYFJtxRFHHb5zeM1Bq7aEcLjETggBHzYFlZ39L665_UchsqP7qiczZ3U-wMNQhlvaTJ0dsPXMB6wPiA06BiINenUFvuyycaV5B7TGqvtytJW4pBfT1Kv7hVgePyVHnsN2IlxeMbNzkTApeb6FHigAjrvuhbRBUJhcO_C79R8-ZpIPvnsU6j7EaTmGOj39E_lE6yJ5Q72yOUYJ7hW2cVeCyFguRp8cBtKHyEYhQSJQCL1OtZH09-vNinrKJF-6Y3oTNZxQgmre1VxLRab58U2NaA6SzD7LPmgGid4ut7bP4EpvqKGaVp7ow";

export const profileUrl = (id) => {
  if (id) {
    return `https://gateway.banjee.org//services/media-service/iwantcdn/resources/${id}?actionCode=ACTION_DOWNLOAD_RESOURCE`;
  }
};

export const userObj = {
  name: "sjpatel",
  age: 13,
  gender: "Male",
  systemUserId: "6267b432caee8667beba56f5",
  avtarUrl: "6267b44d4d2f4a7e3ae903b1",
  online: false,
  origin: {
    type: "Point",
    coordinates: [72.4992223, 23.0476566],
  },
  currentLocation: {
    lon: 72.4992223,
    lat: 23.0476566,
  },
  locationName: "Thaltej - Shilaj Road",
  connectionExists: false,
  existsInContact: false,
  pendingRequest: false,
  connections: [
    "6176b3a771748e095f9a2d2a",
    "624d1a5251d8313090ec9fea",
    "6267b7257e4a6a4e8db21b3c",
  ],
  pendingConnections: [
    "62613ff4d8279f31a7b03004",
    "62a058a47e4a6a4e8db27f23",
    "62b0a06ccaee8667bebac84f",
    "62c157c87e4a6a4e8db2aabb",
    "619cd4fc3fb9cb741a6d7d8f",
  ],
  blockedList: ["6267b7257e4a6a4e8db21b3c", "6267b7257e4a6a4e8db21b3c"],
  currentUser: {
    authorities: ["ROLE_CUSTOMER"],
    avtarImageUrl: "6267b44d4d2f4a7e3ae903b1",
    domain: "208991",
    domainSsid: "208991",
    email: "sjpatel@gmail.com",
    externalReferenceId: "6267b43296ecf311dd8bfc7a",
    firstName: "Samarth",
    id: "6267b432caee8667beba56f5",
    lastName: "Patel",
    locale: "eng",
    mcc: "+267",
    mobile: "989898",
    profileImageUrl: null,
    realm: "banjee",
    timeZoneId: "GMT",
    type: "CUSTOMER",
    userName: "sjpatel",
    userType: 0,
  },
  userObject: {
    avtarUrl: "6267b44d4d2f4a7e3ae903b1",
    domainSsid: "208991",
    firstName: "Samarth",
    lastName: "Patel",
    mobile: "989898",
    email: "sjpatel@gmail.com",
    locale: "eng",
    timeZoneId: "GMT",
    mcc: "+267",
    realm: "banjee",
    domain: "208991",
  },
  email: "sjpatel@gmail.com",
  voiceIntroSrc: "",
  voiceIntroId: "",
  incognito: false,
  verifiedProfile: false,
  mutual: false,
  createdBy: "6267b432caee8667beba56f5",
  inactive: false,
  deleted: false,
  ipAddress: "172.31.21.56",
  domain: "208991",
  sequenceNumber: 0,
  realm: "208991",
};

export const rjPatelData = {
  age: 0,
  avtarUrl: "6267b44d4d2f4a7e3ae903b1",
  birthDate: null,
  callType: "Video",
  chatroomId: "62b97b2467939370a84cc5f3",
  connectedUserOnline: false,
  domain: null,
  email: null,
  firstName: "rJpatel",
  gender: "Male",
  id: "6267b7257e4a6a4e8db21b3c",
  lastName: null,
  locale: null,
  mcc: null,
  mobile: null,
  name: null,
  realm: null,
  ssid: null,
  systemUserId: null,
  timeZoneId: null,
  userId: "62b97b24028f1a2cf388bb8e",
  userLastSeen: "2022-07-07T11:49:18.884+00:00",
  username: null,
};
