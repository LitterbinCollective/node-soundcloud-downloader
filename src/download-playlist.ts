import { AxiosInstance } from 'axios'
import { download } from './download'
import { getSetInfo } from './info'

export const downloadPlaylist = async (url: string, clientID: string, axiosInstance: AxiosInstance): Promise<[ReadableStream<any>[], String[]]> => {
  const info = await getSetInfo(url, clientID, axiosInstance)

  const trackNames: string[] = []
  const result = await Promise.all(info.tracks.map(track => {
    if (!track.permalink_url || !track.title)
      throw new Error(`Invalid response from Soundcloud. Check if the URL provided is correct: ${url}`)
    const p = download(track.permalink_url, clientID, axiosInstance)
    trackNames.push(track.title)
    return p
  }))

  return [result, trackNames]
}
