import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const DEFAULT_PLAYLIST_URL = "https://c6.y.qq.com/base/fcgi-bin/u?__=EvlFY3MkHbDd";
const playlistUrl = process.argv[2] ?? DEFAULT_PLAYLIST_URL;

function extractPlaylistId(url) {
  const directMatch = url.match(/playlist\/(\d+)/);
  if (directMatch) {
    return directMatch[1];
  }

  const disstid = new URL(url).searchParams.get("disstid");
  return disstid;
}

async function resolvePlaylistUrl(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0",
      referer: "https://y.qq.com/",
    },
  });

  return response.url || url;
}

async function fetchPlaylist(playlistId) {
  const apiUrl = new URL("https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg");
  apiUrl.search = new URLSearchParams({
    type: "1",
    json: "1",
    utf8: "1",
    onlysong: "0",
    disstid: playlistId,
    format: "json",
    g_tk: "5381",
    loginUin: "0",
    hostUin: "0",
    inCharset: "utf8",
    outCharset: "utf-8",
    notice: "0",
    platform: "yqq.json",
    needNewCode: "0",
  }).toString();

  const response = await fetch(apiUrl, {
    headers: {
      "user-agent": "Mozilla/5.0",
      referer: "https://y.qq.com/",
    },
  });

  if (!response.ok) {
    throw new Error(`QQ音乐接口请求失败：${response.status}`);
  }

  const payload = await response.json();
  const playlist = payload.cdlist?.[0];

  if (!playlist) {
    throw new Error("QQ音乐接口没有返回歌单数据。");
  }

  return playlist;
}

function normalizeSong(song) {
  const singers = song.singer?.map((item) => item.name).filter(Boolean) ?? [];
  const albumName = song.album?.name || song.albumname || "未知专辑";
  const albumMid = song.album?.mid || song.albummid || "";

  return {
    title: song.name || song.songname || "未命名歌曲",
    artist: singers.join(" / ") || "未知歌手",
    album: albumName,
    albumMid,
    duration: Number(song.interval || 0),
    mid: song.mid || song.songmid || "",
  };
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function toTypeScript(data) {
  return `export type QQImportedSong = {
  title: string;
  artist: string;
  album: string;
  albumMid: string;
  duration: number;
  durationText: string;
  mid: string;
};

export const qqImportedPlaylist = ${JSON.stringify(data, null, 2)} as const;
`;
}

async function main() {
  const resolvedUrl = await resolvePlaylistUrl(playlistUrl);
  const playlistId = extractPlaylistId(resolvedUrl);

  if (!playlistId) {
    throw new Error(`无法从链接中识别歌单 ID：${resolvedUrl}`);
  }

  const playlist = await fetchPlaylist(playlistId);
  const songs = (playlist.songlist ?? []).map((song) => {
    const normalized = normalizeSong(song);
    return {
      ...normalized,
      durationText: formatSeconds(normalized.duration),
    };
  });

  const importedData = {
    playlistId,
    playlistUrl,
    resolvedUrl,
    name: playlist.dissname || "QQ音乐歌单",
    description: playlist.desc || "",
    coverUrl: playlist.logo || "",
    ownerName: playlist.nickname || playlist.nick || "",
    songCount: Number(playlist.songnum || songs.length),
    importedAt: new Date().toISOString(),
    songs,
  };

  const outFile = resolve("src/data/qqImportedPlaylist.ts");
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, toTypeScript(importedData), "utf8");

  console.log(`已同步 QQ音乐歌单：${importedData.name}`);
  console.log(`歌单 ID：${playlistId}`);
  console.log(`歌曲数量：${songs.length}`);
  console.log(`输出文件：${outFile}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
