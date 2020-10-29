import React, { useRef, useEffect } from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { LocalVideoTrack, Track, LogLevels } from 'twilio-video';

interface MediaStreamTrackPublishOptions {
  name?: string;
  priority: Track.Priority;
  logLevel: LogLevels;
}

const Container = styled('div')(({ theme }) => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;

  return {
    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
    },
  };
});

export default function Room() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { room } = useVideoContext();

  useEffect(() => {
    const canvas = canvasRef?.current;

    if (canvas && room.localParticipant.identity === 'canvas') {
      const ctx = canvas.getContext('2d')!;
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, 150, 75);

      const stream = canvas.captureStream(30);
      const track = new LocalVideoTrack(stream.getVideoTracks()[0]);

      console.log('canvas track!', track);

      room.localParticipant.publishTrack(track, {
        name: 'canvasStream',
        priority: 'low',
      } as MediaStreamTrackPublishOptions);
    }
  }, []);
  return (
    <Container>
      <canvas width={300} height={300} style={{ zIndex: 100, backgroundColor: 'white' }} ref={canvasRef}></canvas>
      <MainParticipant />
      <ParticipantList />
    </Container>
  );
}
