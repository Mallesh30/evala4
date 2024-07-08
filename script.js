async function fetchBlogPosts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    const posts = await response.json();
    displayBlogPosts(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
}

function displayBlogPosts(posts) {
  const homeSection = document.getElementById("home");
  homeSection.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <small>Author: ${post.author}</small>
                <button onclick="editPost(${post.id})">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
            `;
    homeSection.appendChild(postElement);
  });
}

document
  .getElementById("create-post-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const postData = {
      title: formData.get("title"),
      content: formData.get("content"),
      author: formData.get("author"),
    };

    try {
      const response = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }
      const newPost = await response.json();
      console.log("Created new post:", newPost);
      fetchBlogPosts();
      this.reset();
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  });

function editPost(postId) {
  const post = findPostById(postId);
  if (post) {
    document.getElementById("update-post").style.display = "block";
    document.getElementById("delete-post").style.display = "none";

    document.getElementById("post-id").value = postId;
    document.getElementById("update-title").value = post.title;
    document.getElementById("update-content").value = post.content;
    document.getElementById("update-author").value = post.author;
  }
}

function findPostById(postId) {
  return null;
}

document
  .getElementById("update-post-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const postData = {
      id: formData.get("id"),
      title: formData.get("title"),
      content: formData.get("content"),
      author: formData.get("author"),
    };

    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/${postData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update blog post");
      }
      const updatedPost = await response.json();
      console.log("Updated post:", updatedPost);
      fetchBlogPosts();
      cancelUpdate();
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  });

function cancelUpdate() {
  document.getElementById("update-post").style.display = "none";
}

async function deletePost(postId) {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (confirmDelete) {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/${postId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }
      console.log("Deleted post:", postId);
      fetchBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  }
}

fetchBlogPosts();
