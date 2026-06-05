export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <a href="mailto:azcarepk@gmail.com">
          <i className="fa-solid fa-envelope" style={{marginRight:'5px',color:'#7ab3f5'}}></i>azcarepk@gmail.com
        </a>
        <a href="https://www.google.com/maps?q=24.9172661,67.0307852&z=17&hl=en" target="_blank" rel="noreferrer" style={{textDecoration:'none',color:'inherit'}}>
          <i className="fa-solid fa-location-dot" style={{marginRight:'5px',color:'#f5a623'}}></i>Karachi, Pakistan
        </a>
      </div>
      <div className="topbar-right">
        <a href="https://www.facebook.com/azcare.pk" target="_blank" rel="noreferrer" className="tb-icon tb-fb" title="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
        <a href="https://www.instagram.com/azcare.pk?igsh=MWlheXkzcjVpNm1zdQ==" target="_blank" rel="noreferrer" className="tb-icon tb-ig" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
        <a href="https://www.youtube.com/@azcarepk" target="_blank" rel="noreferrer" className="tb-icon tb-yt" title="YouTube"><i className="fa-brands fa-youtube"></i></a>
        <a href="https://www.google.com/search?q=AZ+Care.pk" target="_blank" rel="noreferrer" className="tb-icon tb-gr" title="Google Reviews"><i className="fa-brands fa-google"></i></a>
        <a href="https://wa.me/923222468123?text=Hello%20AZ%20Care%20Assalam%20o%20Alaikum!%20Mujhe%20cleaning%20service%20chahiye." target="_blank" rel="noreferrer" className="tb-icon tb-wa" title="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
        <a href="https://www.tiktok.com/@azcarepk?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" className="tb-icon tb-tt" title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
      </div>
    </div>
  );
}
