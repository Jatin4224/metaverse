const { default: axios } = require("axios");

function sum(a, b) {
  return a + b;
}

// test("adds 1 + 2 to equal 3", () => {
//   let ans = sum(1, 2);
//   expect(ans).toBe(3);
// });

//describe Blocks : In Jest, describe blocks are used to organize and group related tests into logical sections. This can be especially helpful for larger test files where grouping tests by function or feature improves readability and structure. Each describe block can contain individual tests (using test or it functions) or nested describe blocks for further sub-grouping.

//hardcoded backend url - we are doing test driven dev in which we will write test first nd backend later.
const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User is able to signUp only once", async () => {
    const username = "jatin" + Math.random(); //jatin31327
    const password = 12345678;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    //In HTTP, a status code 200 means "OK"
    expect(response.statusCode).toBe(200);

    //The HTTP status code 400 means "Bad Request"
    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    //In HTTP, a status code 200 means "OK"
    expect(updatedResponse.statusCode).toBe(400);
  });

  test("Signup Request failes if the username is empty", async () => {
    const username = `Jatin-${Math.random()}`;
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });

    expect(response.statusCode).toBe(400);
  });

  //for singin endpoints

  test("Signin succeeds if the username and password are correct", async () => {
    const username = `jatin-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("SignIn fails if the username and password are incorrect", async () => {
    const username = `jatin-${Math.random()}`;
    const password = 123456;

    await axios.post(`${BACKEND_URL}/api/v1/signup`);

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "WrongUsername",
      password,
    });
    //
    // The HTTP status code 403 means "Forbidden". This status code is part of the 4xx class of client error responses and indicates that the server understands the request but refuses to authorize it.
    expect(response.statusCode).toBe(403);
  });
});

//
// In Jest, the beforeAll and beforeEach functions are setup functions used to run specific code before tests execute.
describe("User metadata endpoints", () => {
  //globalvariable
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `jatin-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;

    //getting avatar id

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name: "Timmy",
    });

    avatarId = avatarResponse.data.avatarId;
  });

  //test case (1) - wrong avatar id case
  test("user cant update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "123123123",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  //test case (2)- success case
  test("User can update their  metadata with thte right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId, //js shorthand syntax wwe can also write avatarId:avatarId
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });

  //test case (3) - if user does not provide auth.

  test("User is not able to update their metadta if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.statusCode).toBe(200);
  });
});
