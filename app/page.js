'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const scenes = [
    {
      text: "Você foi contratado como segurança noturno na Freddy Fazbear's Pizza...",
      background: '#1a0033',
      image: '🐻',
      duration: 4000
    },
    {
      text: "Seu turno começa à meia-noite e termina às 6 da manhã.",
      background: '#000033',
      image: '🕛',
      duration: 3500
    },
    {
      text: "Os animatrônicos começam a se mover pela pizzaria...",
      background: '#330000',
      image: '🤖',
      duration: 4000
    },
    {
      text: "Freddy Fazbear está se aproximando do seu escritório!",
      background: '#4d0000',
      image: '🐻',
      duration: 3500
    },
    {
      text: "Você ouve passos no corredor à esquerda...",
      background: '#1a1a00',
      image: '👂',
      duration: 3500
    },
    {
      text: "Bonnie aparece na porta! Feche rápido!",
      background: '#000066',
      image: '🐰',
      duration: 3000
    },
    {
      text: "Sua energia está acabando... 20% restante!",
      background: '#4d0000',
      image: '🔋',
      duration: 3500
    },
    {
      text: "Chica está na cozinha fazendo barulho...",
      background: '#4d4d00',
      image: '🐤',
      duration: 3500
    },
    {
      text: "Foxy está correndo pelo corredor! CUIDADO!",
      background: '#660000',
      image: '🦊',
      duration: 3000
    },
    {
      text: "6 AM! Você sobreviveu à primeira noite!",
      background: '#004d00',
      image: '🎉',
      duration: 4000
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scene = scenes[currentScene];

    // Clear canvas
    ctx.fillStyle = scene.background;
    ctx.fillRect(0, 0, 1080, 1920);

    // Draw emoji
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.image, 540, 800);

    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    const words = scene.text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 900 && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    const lineHeight = 60;
    const startY = 1400;
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), 540, startY + (index * lineHeight));
    });

    // Scene number
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.fillText(`Cena ${currentScene + 1}/${scenes.length}`, 540, 1850);

  }, [currentScene]);

  const startRecording = async () => {
    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000
    });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'historia-fnaf-9x16.webm';
      a.click();
      setIsRecording(false);
      setCurrentScene(0);
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Auto-advance scenes
    for (let i = 0; i < scenes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, scenes[i].duration));
      if (i < scenes.length - 1) {
        setCurrentScene(i + 1);
      }
    }

    mediaRecorder.stop();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0033 0%, #330000 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      gap: '30px'
    }}>
      <h1 style={{
        color: '#ffffff',
        fontSize: '48px',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(255,0,0,0.5)',
        margin: 0
      }}>
        🐻 Gerador de Vídeo FNAF 🐻
      </h1>

      <p style={{
        color: '#cccccc',
        fontSize: '20px',
        textAlign: 'center',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        História de Five Nights at Freddy's em formato vertical 9:16 para redes sociais
      </p>

      <canvas
        ref={canvasRef}
        width={1080}
        height={1920}
        style={{
          maxWidth: '360px',
          maxHeight: '640px',
          border: '3px solid #ff0000',
          borderRadius: '10px',
          boxShadow: '0 0 30px rgba(255,0,0,0.5)'
        }}
      />

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentScene(Math.max(0, currentScene - 1))}
          disabled={currentScene === 0 || isRecording}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            background: currentScene === 0 || isRecording ? '#555' : '#4d0000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: currentScene === 0 || isRecording ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
        >
          ⬅️ Anterior
        </button>

        <button
          onClick={() => setCurrentScene(Math.min(scenes.length - 1, currentScene + 1))}
          disabled={currentScene === scenes.length - 1 || isRecording}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            background: currentScene === scenes.length - 1 || isRecording ? '#555' : '#4d0000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: currentScene === scenes.length - 1 || isRecording ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
        >
          Próxima ➡️
        </button>

        <button
          onClick={startRecording}
          disabled={isRecording}
          style={{
            padding: '15px 40px',
            fontSize: '20px',
            background: isRecording ? '#555' : '#ff0000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: isRecording ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255,0,0,0.5)',
            animation: isRecording ? 'pulse 1s infinite' : 'none'
          }}
        >
          {isRecording ? '🔴 Gravando...' : '🎬 Gravar Vídeo'}
        </button>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.5)',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '600px',
        color: '#ffffff'
      }}>
        <h3 style={{ marginTop: 0, color: '#ff6666' }}>📋 Instruções:</h3>
        <ol style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Use os botões para navegar pelas cenas da história</li>
          <li>Clique em "Gravar Vídeo" para iniciar a gravação</li>
          <li>O vídeo será gerado automaticamente em formato 9:16</li>
          <li>Após a gravação, o arquivo será baixado automaticamente</li>
          <li>Compartilhe nas redes sociais (TikTok, Instagram Reels, YouTube Shorts)</li>
        </ol>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
