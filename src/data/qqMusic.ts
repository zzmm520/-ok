import { profile } from "./profile";
import { qqImportedPlaylist } from "./qqImportedPlaylist";

export const qqMusicSync = {
  playlistUrl: qqImportedPlaylist.playlistUrl || profile.qqMusicPlaylistUrl,
  resolvedUrl: qqImportedPlaylist.resolvedUrl,
  status: qqImportedPlaylist.songs.length > 0 ? "已完成首次解析" : "已绑定公开歌单链接",
  lastSyncText: qqImportedPlaylist.importedAt
    ? new Date(qqImportedPlaylist.importedAt).toLocaleString("zh-CN")
    : "等待首次自动同步",
  syncMode: "本地解析脚本 + 网站数据写入",
  playlistName: qqImportedPlaylist.name,
  playlistDescription: qqImportedPlaylist.description,
  coverUrl: qqImportedPlaylist.coverUrl,
  ownerName: qqImportedPlaylist.ownerName,
  totalLinkedSongs: qqImportedPlaylist.songCount || qqImportedPlaylist.songs.length,
  matchedSongs: qqImportedPlaylist.songs.slice(0, 12).map((song) => ({
    title: song.title,
    artist: song.artist,
    album: song.album,
    mid: song.mid,
    durationText: song.durationText,
  })),
  pipeline: [
    {
      title: "读取歌单链接",
      description: "解析短链接并识别真实 QQ音乐歌单 ID。",
      state: "已完成",
    },
    {
      title: "歌单解析服务",
      description: "请求 QQ音乐公开歌单接口，提取歌曲、歌手、专辑、时长和封面。",
      state: "已接入",
    },
    {
      title: "写入网站数据",
      description: "生成 src/data/qqImportedPlaylist.ts，前端自动读取展示。",
      state: "已完成",
    },
    {
      title: "私人后台管理",
      description: "未来在 /admin 中手动触发同步、修正标签和评价。",
      state: "规划中",
    },
  ],
};
