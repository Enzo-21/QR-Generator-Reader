import { Download, QrCode2Outlined, QrCodeScanner, Stop } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Fab, Input, Toolbar, Tooltip, Typography } from '@mui/material'
import QrScanner from 'qr-scanner';
import { QRCodeSVG } from '@cheprasov/qrcode';
import {
  toPng, // Import the toPng function from html-to-image
} from 'html-to-image';
import QrLogo from './assets/pony.png'
import React, { useEffect, useRef, useState } from 'react'

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [qrInfo, setQrInfo] = useState('');
  const [qrText, setQrText] = useState(''); // TODO: State variable to store the input text
  const [qrCodeSvg, setQrCodeSvg] = useState(null); // TODO: State variable to store generated QR code SVG
  const svgRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let scanner;

    // Function to start the QR code scanner
    const startScanner = async () => {
      setIsScanning(true);

      try {
        const videoElement = videoRef.current;
        if (!videoElement) {
          return;
        }

        // Initialize the QR scanner
        scanner = new QrScanner(videoElement, async result => {
          setQrInfo(result.data); // Set the scanned QR code information
          await stopScanner();   // Stop the scanner when information is obtained
        }, {
          onDecodeError: error => {
            console.log(error);
            // Handle decode errors here, if any
          },
          maxScansPerSecond: 2,
          highlightCodeOutline: true,
          highlightScanRegion: true,
          returnDetailedScanResult: true,
        });

        await scanner.start(); // Start the QR scanner
      } catch (error) {
        console.log(error);
        // Handle other errors here
      }
    };

    // Function to stop the QR scanner
    const stopScanner = async () => {
      if (scanner) {
        await scanner.stop();
        scanner.destroy();
      }
      setIsScanning(false); // Set isScanning to false to stop rendering the camera
    };

    // Determine whether to start or stop the scanner based on isScanning state
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }

    // Cleanup function: Stop the scanner when the component unmounts
    return () => {
      stopScanner();
    };
  }, [isScanning]);

  // Function to toggle the scanner on/off
  const toggleScanner = () => {
    setIsScanning(prevIsScanning => !prevIsScanning);
  };

  const generateQR = () => {

    const config = {
      level: 'H', // use high error correction level
      padding: 1, 
      image: {
        source: QrLogo, 
        width: '20%',
        height: '20%',
        x: 'center',
        y: 'center',
      }
    };

    const qrSVG = new QRCodeSVG(qrText, config);
    const svg = qrSVG.toString();
    setQrCodeSvg(svg)
  }

  const downloadAsPng = () => {
    toPng(svgRef.current) // Use the toPng function from html-to-image
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error generating PNG:', error);
      });
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
            <QrCode2Outlined />
          </Avatar>
          <Typography variant='h6'>
            QR Code Generator & Scanner
          </Typography>
        </Toolbar>
      </AppBar>


      <Box sx={{ width: 1, display: 'flex' }}>
        <Box sx={{ width: 1 / 2, display: 'flex', height: '100vh', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRight: '2px solid lightgray' }}>
          {isScanning ? (
            <video ref={videoRef} id='scanView' style={{
              width: '400px',
              minWidth: '400px',
              minHeight: '400px',
              maxHeight: '400px',
              borderStyle: 'none'
            }}>
            </video>
          ) : (
            <Typography variant='h6'>
              {qrInfo || 'Touch the button to start scanning'}
            </Typography>
          )}

          {/* Button to toggle the scanner */}
          <Fab color={isScanning ? 'secondary' : 'primary'} sx={{ position: 'absolute', bottom: 16, right: 16 }}
            onClick={toggleScanner}
          >
            {isScanning ? <Stop /> : <QrCodeScanner />}
          </Fab>
        </Box>


        <Box sx={{ width: 1 / 2, display: 'flex', height: '100vh', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRight: '2px solid lightgray' }}>

          {/* TODO: MAKE THE INPUT STORE THE TEXT IN A STATE VARIABLE */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Input
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="Enter text for QR code" // TODO: Update placeholder text
            />

            {/* Render the SVG using dangerouslySetInnerHTML */}
            <div
              ref={svgRef}
              dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
              style={
                {
                  height: qrCodeSvg ? '400px' : '0',
                  width: '400px',
                  maxWidth: '100%',
                  display: 'block',
                  margin: '0 auto'
                }
              }
            ></div>

            {qrCodeSvg && (
              <>
                {/* Button to toggle the scanner */}
                <Tooltip title="Download QR">
                  <Fab sx={{ margin: '0 auto' }} color={'secondary'} onClick={downloadAsPng}
                  >
                    <Download />
                  </Fab>
                </Tooltip>
              </>
            )}

          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            onClick={generateQR}
          >
            Generate
          </Button>
        </Box>

      </Box>

    </>
  )
}

export default App;
