import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
  jwtSigningKey: process.env.MUX_SIGNING_KEY_ID,
  jwtPrivateKey: process.env.MUX_SIGNING_KEY_PRIVATE,
});

export { mux };

export async function getSignedPlaybackToken(
  playbackId: string
): Promise<string> {
  return mux.jwt.signPlaybackId(playbackId, {
    type: "video",
    expiration: "1h",
  });
}

export async function getSignedThumbnailToken(
  playbackId: string
): Promise<string> {
  return mux.jwt.signPlaybackId(playbackId, {
    type: "thumbnail",
    expiration: "1h",
  });
}
