import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer';
import NotFound from './NotFound';

const Watch: FC = () => {
  const { id } = useParams<{ id?: string }>();

  if (!id) {
    return (
      <div className="p-6 md:p-12 relative">
        No Movie Selected...
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {id !== "404-not-found" && <VideoPlayer videoId={id} isMuted={true} />}
      {id === "404-not-found" && <NotFound/>}
    </div>
  )
}

export default Watch