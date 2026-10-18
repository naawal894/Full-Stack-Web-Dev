// Task 1: Fetch user from a dummy API
async function fetchUser(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

    if (!response.ok) {
      throw new Error(`User not found (Status: ${response.status})`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    return { error: error.message };
  }
}

// Test cases
async function run() {
  console.log("Fetching valid user (ID 1):");
  const user = await fetchUser(1);
  console.log(user);

  console.log("\nFetching invalid user (ID 999):");
  const error = await fetchUser(999);
  console.log(error);
}

run();
