import Image from 'next/image';

function MyImg() {
  return (
    <div>
      <h1>My Chart Image</h1>
      <Image 
        src="https://cdn.pixabay.com/photo/2021/05/11/17/21/charts-6246450_1280.png" 
        alt="Charts Image" 
        width={1280} 
        height={853} 
      />
    </div>
  );
}

export default MyImg;