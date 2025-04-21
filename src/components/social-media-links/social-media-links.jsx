const SocialMediaLinks = () => {
  return (
    <div
      style={{
        display: 'flex', // Flexbox for horizontal alignment
        gap: '12px', // Space between logos
        alignItems: 'center' // Vertically align items
      }}
    >
      <a
        href="https://www.instagram.com/finratesindia"
        target="_blank"
        rel="noopener noreferrer"
        className="menu-link"
        style={{
          display: 'inline-flex',
          width: 24,
          height: 24,
          marginRight: 12
        }}
      >
        <img
          src="/instagram.svg"
          alt="Instagram"
          style={{ width: 36, height: 36 }}
        />
      </a>
      <a
        href="https://x.com/finratesindia"
        target="_blank"
        rel="noopener noreferrer"
        className="menu-link"
        style={{ display: 'inline-flex', width: 24, height: 24, mt: 1 }}
      >
        <img src="/x.svg" alt="X" style={{ width: 32, height: 32 }} />
      </a>
    </div>
  );
};

export default SocialMediaLinks;
