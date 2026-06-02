/**
 * FumbleReviewer Logic and Animation Engine
 * Handcrafted interactive mechanics, dynamic star selection, flying evasion buttons,
 * lightweight custom canvas confetti, and background particle generator.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const welcomePane = document.getElementById("step-welcome");
  const ratingPane = document.getElementById("step-rating");
  const jokePane = document.getElementById("step-joke-question");
  const reallyPane = document.getElementById("step-really-question");
  const successPane = document.getElementById("step-success");
  const mainCard = document.getElementById("main-card");

  const btnStart = document.getElementById("btn-start");
  const ratingForm = document.getElementById("rating-form");
  
  const btnJokeYes = document.getElementById("btn-joke-yes");
  const btnJokeNo = document.getElementById("btn-joke-no");
  const btnReallyYes = document.getElementById("btn-really-yes");
  const btnReallyNo = document.getElementById("btn-really-no");
  const btnFinalAction = document.getElementById("btn-final-action");
  const finalDivider = document.getElementById("final-divider");
  
  const particlesContainer = document.getElementById("particles-container");
  const statusSpinner = document.getElementById("status-spinner");
  const statusMessage = document.getElementById("status-message");
  const demoWarning = document.getElementById("demo-warning");

  // State Store
  const ratings = {
    performance: 0,
    jokes: 0,
    movie: 0,
    comments: ""
  };

  const ratingTexts = {
    1: "Awit, fumbled malala. Pa-delete ng log metrics. 💀",
    2: "K lang. May room for improvement pa.",
    3: "Goods naman! At least tumawa ka diba? 🥺",
    4: "Ganda ng vibe! Certified Veteran Flirter na ba?",
    5: "Solid! Dream date material achieved. 🏆"
  };

  // --- Step Navigation Controller ---
  function goToStep(currentPane, nextPane) {
    // Elegant fade out
    currentPane.style.opacity = "0";
    currentPane.style.transform = "translateY(-20px) scale(0.98)";
    
    // Slight card bounce on screen transitions
    mainCard.style.transform = "scale(0.98)";
    
    setTimeout(() => {
      currentPane.classList.remove("active");
      nextPane.classList.add("active");
      
      // Ensure layout repaint before visual slide-in
      setTimeout(() => {
        nextPane.style.opacity = "1";
        nextPane.style.transform = "translateY(0) scale(1)";
        mainCard.style.transform = "scale(1)";
      }, 50);
    }, 400);
  }

  // --- Interactive Star Rating Handlers ---
  const starGroups = ["performance", "jokes", "movie"];
  
  starGroups.forEach(groupName => {
    const starContainer = document.getElementById(`stars-${groupName}`);
    const descLabel = document.getElementById(`desc-${groupName}`);
    const stars = starContainer.querySelectorAll(".star-btn");

    stars.forEach(star => {
      // 1. Mouse Over / Hover Dynamic
      star.addEventListener("mouseover", () => {
        const val = parseInt(star.getAttribute("data-value"));
        highlightStars(stars, val);
        descLabel.textContent = ratingTexts[val] || "Select rating";
        descLabel.style.color = "var(--primary)";
      });

      // 2. Mouse Out / Reset Dynamic
      star.addEventListener("mouseout", () => {
        highlightStars(stars, ratings[groupName]);
        updateDescriptorText(groupName, ratings[groupName]);
      });

      // 3. Click / Lock Value
      star.addEventListener("click", () => {
        const val = parseInt(star.getAttribute("data-value"));
        ratings[groupName] = val;
        lockStars(stars, val);
        updateDescriptorText(groupName, val);
        
        // Success pulse effect on star group
        starContainer.style.transform = "scale(1.02)";
        setTimeout(() => {
          starContainer.style.transform = "scale(1)";
        }, 150);
      });
    });
  });

  function highlightStars(stars, count) {
    stars.forEach(star => {
      const starVal = parseInt(star.getAttribute("data-value"));
      if (starVal <= count) {
        star.classList.add("hovered");
      } else {
        star.classList.remove("hovered");
      }
    });
  }

  function lockStars(stars, count) {
    stars.forEach(star => {
      const starVal = parseInt(star.getAttribute("data-value"));
      if (starVal <= count) {
        star.classList.add("selected");
      } else {
        star.classList.remove("selected");
      }
    });
  }

  function updateDescriptorText(groupName, value) {
    const descLabel = document.getElementById(`desc-${groupName}`);
    if (value > 0) {
      descLabel.textContent = ratingTexts[value];
      descLabel.style.color = "var(--star-gold)";
    } else {
      descLabel.textContent = "Select rating";
      descLabel.style.color = "var(--text-muted)";
    }
  }

  // --- Step Triggers ---

  // Welcome -> Scorecard
  btnStart.addEventListener("click", () => {
    goToStep(welcomePane, ratingPane);
  });

  // Scorecard Submission -> Joke Verification
  ratingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Verification: ensure all stars are rated
    let allRated = true;
    starGroups.forEach(groupName => {
      if (ratings[groupName] === 0) {
        allRated = false;
        const groupEl = document.querySelector(`.rating-group[data-rating-type="${groupName}"]`);
        
        // Add error animation
        groupEl.style.borderColor = "var(--danger)";
        groupEl.style.boxShadow = "0 0 15px var(--danger-glow)";
        groupEl.style.transform = "translateX(5px)";
        
        setTimeout(() => { groupEl.style.transform = "translateX(-5px)"; }, 80);
        setTimeout(() => { groupEl.style.transform = "translateX(4px)"; }, 160);
        setTimeout(() => { groupEl.style.transform = "translateX(-4px)"; }, 240);
        setTimeout(() => { groupEl.style.transform = "translateX(0)"; }, 320);

        setTimeout(() => {
          groupEl.style.borderColor = "";
          groupEl.style.boxShadow = "";
        }, 3000);
      }
    });

    if (!allRated) {
      return; // Stop form submission
    }

    ratings.comments = document.getElementById("comments").value;
    goToStep(ratingPane, jokePane);
  });

  // Joke Yes -> Really Verification Screen
  btnJokeYes.addEventListener("click", () => {
    goToStep(jokePane, reallyPane);
  });

  // Really Yes -> Success / Validation Complete Screen
  btnReallyYes.addEventListener("click", () => {
    goToStep(reallyPane, successPane);
    startConfetti();
  });

  // Final Action on Success Screen -> Submit scorecard
  btnFinalAction.addEventListener("click", () => {
    btnFinalAction.style.display = "none";
    finalDivider.style.display = "block";
    const statusContainer = document.getElementById("submission-status");
    statusContainer.style.display = "flex";
    triggerSuccessFlow();
    startConfetti();
  });

  // --- Fleeing "No" Button Mechanics ---
  let reallyYesScale = 1.0;
  const evadeTriggers = ["mouseenter", "mousemove", "touchstart"];

  // Helper to temporarily disable pointer events on YES button to prevent accidental click propagation!
  function temporarilyDisableYesButton(yesBtn) {
    if (!yesBtn) return;
    yesBtn.style.pointerEvents = "none";
    
    // Clear any existing active timeout to prevent race conditions
    if (yesBtn.disableTimeout) {
      clearTimeout(yesBtn.disableTimeout);
    }
    
    // Re-enable pointer events after 350ms (plenty of time for click propagation cycle to finish)
    yesBtn.disableTimeout = setTimeout(() => {
      yesBtn.style.pointerEvents = "";
    }, 350);
  }

  // Both buttons evade on hover/touch
  [btnJokeNo, btnReallyNo].forEach(noBtn => {
    evadeTriggers.forEach(triggerType => {
      noBtn.addEventListener(triggerType, (e) => {
        growYesAndEvade(noBtn, e);
      });
    });
  });

  // Explicit click/tap handler: grow YES button and evade No button
  [btnJokeNo, btnReallyNo].forEach(noBtn => {
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      growYesAndEvade(noBtn, e, true); // True means it was an actual click!
    });
  });

  function growYesAndEvade(btn, event, isClick = false) {
    // Identify corresponding Yes button to block accidental click propagation!
    let yesBtn = null;
    if (btn === btnJokeNo) {
      yesBtn = btnJokeYes;
    } else if (btn === btnReallyNo) {
      yesBtn = btnReallyYes;
    }

    if (yesBtn) {
      temporarilyDisableYesButton(yesBtn);
    }

    // 1. If it's the really verification screen, make the Yes button grow bigger!
    if (btn === btnReallyNo) {
      // Grow Yes button on hover or click
      const increment = isClick ? 0.35 : 0.2;
      reallyYesScale += increment;
      
      btnReallyYes.style.transform = `scale(${reallyYesScale})`;
      btnReallyYes.style.boxShadow = `0 8px ${25 * reallyYesScale}px rgba(16, 185, 129, 0.5)`;
    }

    // 2. Perform the evasion jumping algorithm
    evade(btn, event);
  }

  function evade(btn, event) {
    // Enable evading absolute card relative layout state
    btn.classList.add("evading");

    const cardWidth = mainCard.clientWidth;
    const cardHeight = mainCard.clientHeight;
    const cardRect = mainCard.getBoundingClientRect();
    
    const btnWidth = btn.offsetWidth || 150;
    const btnHeight = btn.offsetHeight || 50;

    // Identify corresponding Yes button to prevent overlapping
    let yesBtn = null;
    if (btn === btnJokeNo) {
      yesBtn = btnJokeYes;
    } else if (btn === btnReallyNo) {
      yesBtn = btnReallyYes;
    }

    // Get Yes button relative position to card
    let yesLeft = 0, yesTop = 0, yesWidth = 0, yesHeight = 0;
    if (yesBtn) {
      const yesRect = yesBtn.getBoundingClientRect();
      yesLeft = yesRect.left - cardRect.left;
      yesTop = yesRect.top - cardRect.top;
      yesWidth = yesRect.width;
      yesHeight = yesRect.height;
    }

    // Keep strictly inside card borders with safe margins
    const margin = 25;
    const minX = margin;
    const maxX = cardWidth - btnWidth - margin;
    const minY = margin;
    const maxY = cardHeight - btnHeight - margin;

    // Get event coordinates relative to the card container
    let clientX = 0;
    let clientY = 0;

    if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event.clientX) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      // Fallback for clicks without screen coordinates
      clientX = cardRect.left + cardWidth / 2;
      clientY = cardRect.top + cardHeight / 2;
    }

    // Translate client coords into coordinates relative to card top-left (0, 0)
    const cursorXInCard = clientX - cardRect.left;
    const cursorYInCard = clientY - cardRect.top;

    let targetX = 0;
    let targetY = 0;
    let distance = 0;
    let attempts = 0;

    // Ensure button moves away from cursor point AND does not overlap Yes button
    do {
      targetX = minX + Math.random() * (maxX - minX);
      targetY = minY + Math.random() * (maxY - minY);

      const dx = targetX + btnWidth / 2 - cursorXInCard;
      const dy = targetY + btnHeight / 2 - cursorYInCard;
      distance = Math.sqrt(dx * dx + dy * dy);

      // Check collision/overlap with Yes button (including 30px breathing padding)
      let overlapsYes = false;
      if (yesBtn) {
        overlapsYes = (
          targetX < yesLeft + yesWidth + 30 &&
          targetX + btnWidth > yesLeft - 30 &&
          targetY < yesTop + yesHeight + 30 &&
          targetY + btnHeight > yesTop - 30
        );
      }

      attempts++;
      
      // Accept only if it is far from cursor AND doesn't overlap Yes button
      if (distance >= 120 && !overlapsYes) {
        break;
      }
    } while (attempts < 45);

    // Clamp coordinates perfectly within card margins to prevent disappearing
    const finalX = Math.max(minX, Math.min(targetX, maxX));
    const finalY = Math.max(minY, Math.min(targetY, maxY));

    // Apply coordinates relative to main card
    btn.style.left = `${finalX}px`;
    btn.style.top = `${finalY}px`;
  }

  // --- Background Particle Generator ---
  function createBackgroundParticles() {
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.classList.add("heart-particle");
      
      // Randomize styles
      const size = Math.random() * 25 + 15; // 15px - 40px
      const left = Math.random() * 100; // 0% - 100%
      const duration = Math.random() * 10 + 10; // 10s - 20s
      const delay = Math.random() * -20; // negative delays create staggered starts instantly
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  createBackgroundParticles();

  // --- Canvas Confetti Burst Engine ---
  function startConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    
    // Set matching resolution
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    const colors = ["#c084fc", "#e879f9", "#34d399", "#f87171", "#fbbf24", "#60a5fa"];
    const particles = [];

    // Populate particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: width / 2,
        y: height / 2 + 50,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        gravity: 0.28,
        drag: 0.98
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach(p => {
        if (p.opacity <= 0) return;
        
        alive = true;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        
        // Fade out as it hits boundaries or slows down
        if (p.y > height - 10) {
          p.opacity -= 0.02;
        } else {
          p.opacity -= 0.005;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        
        // Draw particle rectangles/ribbons
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (alive) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }

  // --- Success Processing & Email Submission ---
  function triggerSuccessFlow() {
    startConfetti();

    // Check if configuration key is active
    const isConfigured = CONFIG && 
                       CONFIG.WEB3FORMS_ACCESS_KEY && 
                       CONFIG.WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE" &&
                       CONFIG.WEB3FORMS_ACCESS_KEY.trim() !== "";

    if (!isConfigured) {
      // Demo fallback state
      setTimeout(() => {
        statusSpinner.style.display = "none";
        statusMessage.innerHTML = "Scorecard simulated successfully! ✨<br><span style='color: var(--primary); font-size: 0.8rem;'>Ready to deploy configuration!</span>";
        demoWarning.style.display = "flex";
      }, 1500);
      return;
    }

    // Prepare mail payload
    const formData = {
      access_key: CONFIG.WEB3FORMS_ACCESS_KEY,
      subject: `💖 Unbiased FumbleReviewer Scorecard Received!`,
      from_name: `FumbleReviewer system`,
      to_email: CONFIG.RECIPIENT_EMAIL || "sedillozandro720@gmail.com",
      
      // Form fields
      "Date Performance Score": `${ratings.performance} / 5 Stars`,
      "Quality of Jokes": `${ratings.jokes} / 5 Stars`,
      "Movie Watched Rating": `${ratings.movie} / 5 Stars`,
      "Optional Comments": ratings.comments || "No comments written.",
      "Was the Special Forces joke funny?": "Yes (Overridden)",
      "Was she really sure?": "Yes (Forced Consent B))"
    };

    // Dispatch payload to Web3Forms API
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(async (response) => {
        const json = await response.json();
        statusSpinner.style.display = "none";
        
        if (response.status === 200) {
          statusMessage.innerHTML = "Scorecard successfully logged in your database! 💖<br>Check your inbox!";
          statusMessage.style.color = "var(--success)";
        } else {
          console.error("Web3Forms error response:", json);
          statusMessage.innerHTML = "Transmission anomaly, but override is active! 🚀";
        }
      })
      .catch((error) => {
        console.error("Web3Forms networks failure:", error);
        statusSpinner.style.display = "none";
        statusMessage.innerHTML = "Scorecard saved offline! System Override Success. 😎";
      });
  }
});
