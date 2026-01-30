// Unity loader without Poki SDK ads
(function() {
    'use strict';

    var gameContainer = document.getElementById("game-container");
    var loader = document.getElementById("loader");
    var progressContainer = document.getElementById("progress-container");
    var progressFill = document.getElementById("progress-fill");
    var progressAmount = document.getElementById("progress-amount");
    var gameStarted = false;

    // Show game container and hide loader
    function showGame() {
        gameContainer.style.display = "block";
        loader.style.display = "none";
        resizeGame();
        if (window.removeSlideshowEventListeners) {
            window.removeSlideshowEventListeners();
        }
    }

    // Start loading the Unity game
    function startLoadingGame() {
        if (gameStarted) return;
        gameStarted = true;

        var script = document.createElement("script");
        script.src = window.config.unityWebglLoaderUrl;
        script.addEventListener("load", function() {
            window.unityGame = window.UnityLoader.instantiate("game", window.config.unityWebglBuildUrl, {
                onProgress: updateProgress,
                Module: {
                    onRuntimeInitialized: showGame
                }
            });
        });
        document.body.appendChild(script);
    }

    // Resize game to fit window
    function resizeGame() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var ratio = width / height;

        if (ratio > window.config.maxRatio) {
            gameContainer.style.height = height + "px";
            gameContainer.style.width = (height * window.config.maxRatio) + "px";
        } else if (ratio < window.config.minRatio) {
            gameContainer.style.width = width + "px";
            gameContainer.style.height = (width / window.config.minRatio) + "px";
        } else {
            gameContainer.style.width = width + "px";
            gameContainer.style.height = height + "px";
        }

        var rect = gameContainer.getBoundingClientRect();
        gameContainer.style.marginLeft = (-0.5 * rect.width) + "px";
        gameContainer.style.marginTop = (-0.5 * rect.height) + "px";
    }

    // Update loading progress
    function updateProgress(gameInstance, progress) {
        if (!gameInstance.Module) return;

        var percentage = 100 * progress;
        progressFill.style.width = percentage + "%";
        progressAmount.innerHTML = (percentage << 0) + "%";

        if (progress >= 1) {
            progressContainer.className = "done";
        }
    }

    // Setup window resize handlers
    window.addEventListener("resize", resizeGame);
    window.addEventListener("focus", resizeGame);

    // Initialize slideshow
    function initSlideshow() {
        var slideshow = document.getElementById("slideshow");
        var slideshowTop = document.getElementById("slideshow-top");
        var slideshowNav = document.getElementById("slideshow-nav");
        var slideshowImages = document.getElementById("slideshow-images");
        
        var numScreenshots = window.config.numScreenshots;
        var currentIdx = 0;
        var slideshowActive = true;

        // Load thumbnail first
        var thumbnail = new Image();
        thumbnail.onload = function() {
            slideshowTop.className = "active";
            
            // Load first screenshot
            var firstImg = new Image();
            firstImg.src = "screenshots/1.jpg";
            firstImg.onload = function() {
                var imgDiv = document.createElement("div");
                imgDiv.className = "image middle";
                imgDiv.setAttribute("data-idx", "0");
                imgDiv.appendChild(firstImg);
                slideshowImages.appendChild(imgDiv);
                
                slideshow.className = "active";
                
                // Start loading the game
                startLoadingGame();
            };
        };
        thumbnail.src = "thumbnail.jpg";

        window.removeSlideshowEventListeners = function() {
            slideshowActive = false;
        };
    }

    // Start when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSlideshow);
    } else {
        initSlideshow();
    }
})();
