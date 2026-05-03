function PostList() {
  const posts = [
    { id: 1, food: "치킨", time: "12:00" },
    { id: 2, food: "피자", time: "13:00" }
  ]

  return (
    <div>
      <h2>게시글 목록</h2>
      {posts.map(post => (
        <div key={post.id}>
          <p>{post.food} - {post.time}</p>
        </div>
      ))}
    </div>
  )
}

export default PostList