import { HiveProvider, HiveAuthorPostList } from "@hiveio/honeycomb-solid";

export default function BlogPosts() {
  return (
    <HiveProvider>
      <HiveAuthorPostList
        account="thebeedevs"
        tag="clive"
        limit={6}
        variant="grid"
        hide={["body"]}
        linkTarget="https://blog.openhive.network"
      />
    </HiveProvider>
  );
}
