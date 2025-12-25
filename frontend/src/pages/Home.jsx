import AvatarViewer from '../components/AvatarViewer'
import Controls from '../components/Controls'

export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <AvatarViewer />
      <Controls />
    </div>
  )
}

