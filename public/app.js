// Prompt: "Build a JS module that detects device orientation (portrait upright, portrait upside down, landscape right-side up, landscape left-side up) and calls a callback with the orientation name."

const ORIENTATIONS = {
  PORTRAIT_UP: 'Portrait Upright',
  PORTRAIT_DOWN: 'Portrait Upside Down',
  LANDSCAPE_RIGHT: 'Landscape Right-Side Up',
  LANDSCAPE_LEFT: 'Landscape Left-Side Up',
};

function getOrientation() {
  const { orientation } = window.screen;
  if (orientation && typeof orientation.angle === 'number') {
    switch (orientation.type) {
      case 'portrait-primary': return ORIENTATIONS.PORTRAIT_UP;
      case 'portrait-secondary': return ORIENTATIONS.PORTRAIT_DOWN;
      case 'landscape-primary': return ORIENTATIONS.LANDSCAPE_RIGHT;
      case 'landscape-secondary': return ORIENTATIONS.LANDSCAPE_LEFT;
      default: return ORIENTATIONS.PORTRAIT_UP;
    }
  }
  // Fallback for browsers without screen.orientation
  if (window.innerHeight > window.innerWidth) {
    return ORIENTATIONS.PORTRAIT_UP;
  } else {
    return ORIENTATIONS.LANDSCAPE_RIGHT;
  }
}

function onOrientationChange(callback) {
  function handler() {
    callback(getOrientation());
  }
  window.addEventListener('orientationchange', handler);
  window.addEventListener('resize', handler);
  handler();
}

// Prompt: "Build a JS function that renders an alarm clock UI with set alarm, show current time, and alarm sound with premium design."
function renderAlarmClock(container) {
  container.innerHTML = `
    <div class="feature-card">
      <h2>🕐 Alarm Clock</h2>
      <div id="clock-time" class="time-display"></div>
      <form id="alarm-form">
        <label>Set Alarm: <input type="time" id="alarm-time" required></label>
        <button type="submit" class="btn-primary">Set Alarm</button>
        <button type="button" id="clear-alarm" class="btn-warning">Clear</button>
      </form>
      <div id="alarm-status" class="status-message" style="display:none;"></div>
    </div>
  `;
  const timeEl = container.querySelector('#clock-time');
  const statusEl = container.querySelector('#alarm-status');
  let alarmTime = null;
  let alarmTimeout = null;
  let isAlarmActive = false;
  
  function updateTime() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], {hour12: false});
    
    if (alarmTime && !isAlarmActive) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const targetTime = alarmTime.getHours() * 60 + alarmTime.getMinutes();
      
      if (currentTime === targetTime && now.getSeconds() === 0) {
        triggerAlarm();
      }
    }
  }
  
  function triggerAlarm() {
    isAlarmActive = true;
    statusEl.textContent = '⏰ ALARM! Tap to stop';
    statusEl.className = 'status-message alarm-active';
    statusEl.style.display = 'block';
    statusEl.style.animation = 'pulse 1s infinite';
    
    // Play alarm sound multiple times
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCSJ+0fPTgjMGHm7A7+OZURE');
    audio.loop = true;
    audio.play();
    
    statusEl.onclick = () => {
      isAlarmActive = false;
      audio.pause();
      audio.currentTime = 0;
      statusEl.style.display = 'none';
      statusEl.onclick = null;
      alarmTime = null;
    };
  }
  
  setInterval(updateTime, 1000);
  updateTime();
  
  container.querySelector('#alarm-form').onsubmit = e => {
    e.preventDefault();
    const val = container.querySelector('#alarm-time').value;
    if (val) {
      const [h, m] = val.split(':');
      alarmTime = new Date();
      alarmTime.setHours(+h, +m, 0, 0);
      statusEl.textContent = `✅ Alarm set for ${val}`;
      statusEl.className = 'status-message';
      statusEl.style.display = 'block';
      statusEl.style.animation = 'none';
    }
  };
  
  container.querySelector('#clear-alarm').onclick = () => {
    alarmTime = null;
    isAlarmActive = false;
    statusEl.style.display = 'none';
  };
}

// Prompt: "Build a JS function that renders a professional stopwatch UI with start, stop, reset, lap times, and smooth animations."
function renderStopwatch(container) {
  container.innerHTML = `
    <div class="feature-card">
      <h2>⏱️ Stopwatch</h2>
      <div id="stopwatch-time" class="time-display">00:00.00</div>
      <div>
        <button id="sw-start" class="btn-success">Start</button>
        <button id="sw-stop" class="btn-primary">Stop</button>
        <button id="sw-reset" class="btn-warning">Reset</button>
        <button id="sw-lap">Lap</button>
      </div>
      <ul id="sw-laps"></ul>
    </div>
  `;
  let startTime = null, elapsed = 0, timer = null, lapCount = 0;
  const timeEl = container.querySelector('#stopwatch-time');
  const lapsEl = container.querySelector('#sw-laps');
  const startBtn = container.querySelector('#sw-start');
  const stopBtn = container.querySelector('#sw-stop');
  const resetBtn = container.querySelector('#sw-reset');
  const lapBtn = container.querySelector('#sw-lap');
  
  function format(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }
  
  function update() {
    const now = Date.now();
    const currentTime = elapsed + (startTime ? now - startTime : 0);
    timeEl.textContent = format(currentTime);
    
    // Add pulsing effect when running
    if (startTime) {
      timeEl.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
    } else {
      timeEl.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    }
  }
  
  function start() {
    if (!startTime) {
      startTime = Date.now();
      timer = setInterval(update, 10); // Higher precision
      startBtn.disabled = true;
      stopBtn.disabled = false;
      lapBtn.disabled = false;
    }
  }
  
  function stop() {
    if (startTime) {
      elapsed += Date.now() - startTime;
      startTime = null;
      clearInterval(timer);
      startBtn.disabled = false;
      stopBtn.disabled = true;
      lapBtn.disabled = true;
      update();
    }
  }
  
  function reset() {
    stop();
    elapsed = 0;
    lapCount = 0;
    lapsEl.innerHTML = '';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
    lapBtn.disabled = true;
    update();
  }
  
  function lap() {
    if (startTime) {
      lapCount++;
      const li = document.createElement('li');
      li.innerHTML = `<strong>Lap ${lapCount}:</strong> ${timeEl.textContent}`;
      li.style.animation = 'fadeIn 0.3s ease';
      lapsEl.appendChild(li);
      lapsEl.scrollTop = lapsEl.scrollHeight;
    }
  }
  
  startBtn.onclick = start;
  stopBtn.onclick = stop;
  resetBtn.onclick = reset;
  lapBtn.onclick = lap;
  
  // Initial state
  stopBtn.disabled = true;
  lapBtn.disabled = true;
  update();
}

// Prompt: "Build a JS function that renders a premium timer UI with settable minutes/seconds, visual progress, start, pause, reset, and sound on finish."
function renderTimer(container) {
  container.innerHTML = `
    <div class="feature-card">
      <h2>⏲️ Timer</h2>
      <form id="timer-form">
        <input type="number" id="timer-min" min="0" max="99" value="5" placeholder="Min"> :
        <input type="number" id="timer-sec" min="0" max="59" value="0" placeholder="Sec">
        <button type="submit" class="btn-success">Set Timer</button>
      </form>
      <div id="timer-time" class="time-display">05:00</div>
      <div style="margin: 1rem 0;">
        <svg width="100" height="100" style="transform: rotate(-90deg);">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
          <circle id="timer-progress" cx="50" cy="50" r="45" fill="none" stroke="#51cf66" stroke-width="6" 
                  stroke-dasharray="283" stroke-dashoffset="283" stroke-linecap="round"
                  style="transition: stroke-dashoffset 1s linear;"/>
        </svg>
      </div>
      <div>
        <button id="timer-start" class="btn-success">Start</button>
        <button id="timer-pause" class="btn-primary">Pause</button>
        <button id="timer-reset" class="btn-warning">Reset</button>
      </div>
      <div id="timer-status" class="status-message" style="display:none;"></div>
    </div>
  `;
  let total = 300, left = 300, timer = null, running = false;
  const timeEl = container.querySelector('#timer-time');
  const statusEl = container.querySelector('#timer-status');
  const progressEl = container.querySelector('#timer-progress');
  const startBtn = container.querySelector('#timer-start');
  const pauseBtn = container.querySelector('#timer-pause');
  const resetBtn = container.querySelector('#timer-reset');
  
  function format(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  
  function updateProgress() {
    const progress = total > 0 ? (total - left) / total : 0;
    const dashOffset = 283 - (283 * progress);
    progressEl.style.strokeDashoffset = dashOffset;
    
    // Change color based on remaining time
    if (left / total > 0.5) {
      progressEl.style.stroke = '#51cf66'; // Green
    } else if (left / total > 0.25) {
      progressEl.style.stroke = '#ffd43b'; // Yellow
    } else {
      progressEl.style.stroke = '#ff6b6b'; // Red
    }
  }
  
  function update() {
    timeEl.textContent = format(left);
    updateProgress();
    
    if (left === 0 && running) {
      running = false;
      clearInterval(timer);
      statusEl.textContent = '⏰ Time\'s up!';
      statusEl.className = 'status-message alarm-active';
      statusEl.style.display = 'block';
      statusEl.style.animation = 'pulse 1s infinite';
      
      // Play completion sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCSJ+0fPTgjMGHm7A7+OZURE');
      audio.play();
      
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      
      // Auto-hide status after 5 seconds
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 5000);
    }
  }
  
  function start() {
    if (!running && left > 0) {
      running = true;
      timer = setInterval(() => {
        if (left > 0) {
          left--;
          update();
        }
      }, 1000);
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      statusEl.style.display = 'none';
    }
  }
  
  function pause() {
    running = false;
    clearInterval(timer);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
  
  function reset() {
    pause();
    left = total;
    statusEl.style.display = 'none';
    update();
  }
  
  container.querySelector('#timer-form').onsubmit = e => {
    e.preventDefault();
    const min = +container.querySelector('#timer-min').value || 0;
    const sec = +container.querySelector('#timer-sec').value || 0;
    total = left = Math.max(1, min * 60 + sec); // Minimum 1 second
    statusEl.textContent = `✅ Timer set to ${format(total)}`;
    statusEl.className = 'status-message';
    statusEl.style.display = 'block';
    statusEl.style.animation = 'none';
    update();
    setTimeout(() => statusEl.style.display = 'none', 2000);
  };
  
  startBtn.onclick = start;
  pauseBtn.onclick = pause;
  resetBtn.onclick = reset;
  
  // Initial state
  pauseBtn.disabled = true;
  update();
}

// Prompt: "Build a JS function that renders a beautiful weather widget using OpenWeatherMap API with location detection, detailed weather info, and error handling."
function renderWeather(container) {
  container.innerHTML = `
    <div class="feature-card">
      <h2>🌤️ Weather of the Day</h2>
      <div id="weather-info">
        <div style="font-size: 1.2rem; margin: 2rem 0;">📍 Getting your location...</div>
      </div>
    </div>
  `;
  
  const weatherInfo = container.querySelector('#weather-info');
  
  if (!navigator.geolocation) {
    weatherInfo.innerHTML = `
      <div class="weather-card">
        <div style="font-size: 1.5rem; color: #ff6b6b;">❌ Location Not Available</div>
        <p>Your browser doesn't support geolocation.</p>
      </div>
    `;
    return;
  }
  
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const apiKey = 'fc15b63de170b7dba44d4a136af28411'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    try {
      weatherInfo.innerHTML = '<div style="font-size: 1.2rem; margin: 2rem 0;">⏳ Fetching weather data...</div>';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok && data.weather && data.weather.length > 0) {
        const weather = data.weather[0];
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
        
        // Get weather emoji
        const weatherEmojis = {
          'clear sky': '☀️',
          'few clouds': '🌤️',
          'scattered clouds': '⛅',
          'broken clouds': '☁️',
          'overcast clouds': '☁️',
          'shower rain': '🌦️',
          'rain': '🌧️',
          'thunderstorm': '⛈️',
          'snow': '❄️',
          'mist': '🌫️',
          'fog': '🌫️'
        };
        
        const emoji = weatherEmojis[weather.description] || '🌤️';
        
        weatherInfo.innerHTML = `
          <div class="weather-card">
            <div class="weather-main">
              <span style="font-size: 3rem;">${emoji}</span>
              <div>
                <div style="font-size: 2.5rem; font-weight: 700;">${temp}°C</div>
                <div style="font-size: 1rem; opacity: 0.8; text-transform: capitalize;">${weather.description}</div>
              </div>
            </div>
            
            <div class="weather-details">
              📍 ${data.name}, ${data.sys.country}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; font-size: 0.9rem;">
              <div style="background: rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 0.5rem;">
                <div style="opacity: 0.7;">Feels like</div>
                <div style="font-size: 1.1rem; font-weight: 600;">${feelsLike}°C</div>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 0.5rem;">
                <div style="opacity: 0.7;">Humidity</div>
                <div style="font-size: 1.1rem; font-weight: 600;">${humidity}%</div>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 0.5rem;">
                <div style="opacity: 0.7;">Wind Speed</div>
                <div style="font-size: 1.1rem; font-weight: 600;">${windSpeed} km/h</div>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 0.5rem;">
                <div style="opacity: 0.7;">Pressure</div>
                <div style="font-size: 1.1rem; font-weight: 600;">${data.main.pressure} hPa</div>
              </div>
            </div>
            
            <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7;">
              Last updated: ${new Date().toLocaleTimeString()}
            </div>
          </div>
        `;
      } else {
        throw new Error(data.message || 'Weather data unavailable');
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      weatherInfo.innerHTML = `
        <div class="weather-card">
          <div style="font-size: 1.5rem; color: #ff6b6b;">🌐 Weather Unavailable</div>
          <p style="margin: 1rem 0;">Unable to fetch weather data.</p>
          <p style="font-size: 0.9rem; opacity: 0.7;">Please check your internet connection or try again later.</p>
          <button onclick="location.reload()" style="margin-top: 1rem;">🔄 Retry</button>
        </div>
      `;
    }
  }, (error) => {
    console.error('Geolocation error:', error);
    weatherInfo.innerHTML = `
      <div class="weather-card">
        <div style="font-size: 1.5rem; color: #ffd43b;">📍 Location Access Needed</div>
        <p style="margin: 1rem 0;">Please allow location access to see weather information.</p>
        <p style="font-size: 0.9rem; opacity: 0.7;">Click the location icon in your browser's address bar and allow location access.</p>
        <button onclick="location.reload()" style="margin-top: 1rem;">🔄 Try Again</button>
      </div>
    `;
  }, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutes
  });
}

// Main app logic
const featureContainer = document.getElementById('feature-container');
const orientationLabel = document.getElementById('orientation-label');

function showFeature(orientation) {
  orientationLabel.textContent = orientation;
  
  // Add smooth transition animation
  featureContainer.style.opacity = '0';
  featureContainer.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    if (orientation === ORIENTATIONS.PORTRAIT_UP) {
      renderAlarmClock(featureContainer);
    } else if (orientation === ORIENTATIONS.LANDSCAPE_RIGHT) {
      renderStopwatch(featureContainer);
    } else if (orientation === ORIENTATIONS.PORTRAIT_DOWN) {
      renderTimer(featureContainer);
    } else if (orientation === ORIENTATIONS.LANDSCAPE_LEFT) {
      renderWeather(featureContainer);
    } else {
      featureContainer.innerHTML = `
        <div class="feature-card">
          <h2>🔄 Rotate Your Device</h2>
          <p style="font-size: 1.1rem; margin: 1.5rem 0;">Discover different features by rotating your device:</p>
          <div style="text-align: left; margin: 1rem 0;">
            <div style="margin: 0.8rem 0;">📱 Portrait Up → 🕐 Alarm Clock</div>
            <div style="margin: 0.8rem 0;">📱 Landscape Right → ⏱️ Stopwatch</div>
            <div style="margin: 0.8rem 0;">📱 Portrait Down → ⏲️ Timer</div>
            <div style="margin: 0.8rem 0;">📱 Landscape Left → 🌤️ Weather</div>
          </div>
        </div>
      `;
    }
    
    // Animate back in
    featureContainer.style.opacity = '1';
    featureContainer.style.transform = 'translateY(0)';
  }, 150);
}

onOrientationChange(showFeature);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Add CSS transition styles to feature container
featureContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
