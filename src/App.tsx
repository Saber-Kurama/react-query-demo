import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  {
    id: "1",
    title: "Post1",
  },
  {
    id: "2",
    title: "Post2",
  },
];
function wait(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("ok"), ms);
  });
}

function App() {
  // const postsQuery = useQuery(['posts'], async () => {
  //   await wait(1000).then(() => [...POSTS])
  // })
  console.log("Posts", POSTS);
  const queryClinet = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("POSTS", POSTS);
      // return Promise.reject(new Error("error"))
      return await wait(1000).then(() => [...POSTS]);
    },
  });
  const newPostMutation = useMutation({
    mutationFn: async (title: string) => {
      return await wait(1000).then(() => {
        POSTS.push({
          id: crypto.randomUUID(),
          title: title,
        });
      });
    },
    onSuccess: (data) => {
      queryClinet.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
  if (postsQuery.isPending) return <div>Loading...</div>;
  if (postsQuery.isError) return <div>Error: {postsQuery.error?.message}</div>;

  return (
    <>
      <div>
        {postsQuery.data?.map((post, index) => (
          <div key={post.id}> {post.title}</div>
        ))}
        <button
          disabled={newPostMutation.isPending || postsQuery.isFetching}
          onClick={() => newPostMutation.mutate("new post")}
        >
          添加
        </button>
      </div>
    </>
  );
}

export default App;
