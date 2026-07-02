async function loadRelease() {
  const heroVersion = document.getElementById('hero-version');
  const heroStatus = document.getElementById('hero-status');
  const title = document.getElementById('download-title');
  const summary = document.getElementById('download-summary');
  const channel = document.getElementById('channel-pill');
  const version = document.getElementById('version-pill');
  const size = document.getElementById('size-pill');
  const downloadButton = document.getElementById('download-button');
  const releaseButton = document.getElementById('release-button');
  const notesBox = document.getElementById('release-notes-box');

  try {
    const response = await fetch('./latest-alpha.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Manifest request failed with ${response.status}`);
    }

    const manifest = await response.json();
    heroVersion.textContent = manifest.version;
    heroStatus.textContent = `${manifest.channel.toUpperCase()} channel published ${formatDate(manifest.publishedAt)}.`;
    title.textContent = manifest.title;
    summary.textContent = manifest.summary;
    channel.textContent = manifest.channel;
    version.textContent = `v${manifest.version}`;
    size.textContent = manifest.asset.sizeLabel;

    if (manifest.asset.downloadUrl) {
      downloadButton.href = manifest.asset.downloadUrl;
      downloadButton.textContent = `Download ${manifest.asset.name}`;
      downloadButton.classList.remove('disabled');
      downloadButton.removeAttribute('aria-disabled');
    }

    if (manifest.releaseUrl) {
      releaseButton.href = manifest.releaseUrl;
      releaseButton.classList.remove('disabled');
      releaseButton.removeAttribute('aria-disabled');
    }

    notesBox.textContent = Array.isArray(manifest.notes)
      ? manifest.notes.map((line) => `- ${line}`).join('\n')
      : 'Release notes unavailable.';
  } catch (error) {
    heroVersion.textContent = 'Unavailable';
    heroStatus.textContent = 'Release metadata could not be loaded yet.';
    notesBox.textContent = `Site is live, but release metadata is not ready yet.\n\n${String(error.message || error)}`;
  }
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return value;
  }
}

loadRelease();
