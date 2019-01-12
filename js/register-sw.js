// Register service worker only if supported
if (navigator.serviceWorker) {
  const navWorker = navigator.serviceWorker;
  navWorker.register('/sw.js').then(function(reg) {
    console.log("Service Worker has been registered successfully!");
  }).catch((e) => {
    console.log("Couldn't register service worker... \n", e);
  });
}
