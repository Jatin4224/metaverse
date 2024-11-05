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
});
