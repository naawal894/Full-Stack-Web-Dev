// Task 2: Use Promise.all() with two async operations and reject if invalid
async function fetchUser(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) {
      throw new Error(`User API error (status ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function fetchPosts(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Posts API error (status ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

function getUserAndPosts(userId) {
  // Use Promise.all to catch multiple promises returned by the two async operations
  return Promise.all([fetchUser(userId), fetchPosts(userId)])
    .then(([user, posts]) => {
      // Check if details fetched by both functions are valid
      const isUserValid = user && !user.error && user.id;
      const arePostsValid = Array.isArray(posts) && !posts.error && posts.length > 0;

      // Reject the main promise if either detail is invalid
      if (!isUserValid || !arePostsValid) {
        return Promise.reject(new Error(`Invalid details fetched for user ID ${userId}`));
      }

      return { user, posts };
    });
}

// Test cases
async function run() {
  console.log("Testing with valid user (ID 1):");
  try {
    const data = await getUserAndPosts(1);
    console.log("Success: Fetched user", data.user.name, "with", data.posts.length, "posts");
  } catch (err) {
    console.log("Rejected:", err.message);
  }

  console.log("\nTesting with invalid user (ID 999):");
  try {
    const data = await getUserAndPosts(999);
    console.log("Success:", data);
  } catch (err) {
    console.log("Rejected:", err.message);
  }
}

run();
