import Mux from "@mux/mux-node";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const mux = new Mux({
  tokenId: requireEnv("MUX_TOKEN_ID"),
  tokenSecret: requireEnv("MUX_TOKEN_SECRET"),
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
