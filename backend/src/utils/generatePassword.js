module.exports = () => {
  const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    num: '0123456789',
    sym: '!@#$%^&*()'
  };
  
  let pwd = '';
  pwd += chars.upper[Math.floor(Math.random() * chars.upper.length)];
  pwd += chars.lower[Math.floor(Math.random() * chars.lower.length)];
  pwd += chars.num[Math.floor(Math.random() * chars.num.length)];
  pwd += chars.sym[Math.floor(Math.random() * chars.sym.length)];

  const all = Object.values(chars).join('');
  for (let i = 0; i < 6; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
};
