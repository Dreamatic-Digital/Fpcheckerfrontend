import imgImage83 from "figma:asset/07591319e4d183aa92b3a37d729d06be75bbf952.png";
import imgScreenshot20251126At10611Pm1 from "figma:asset/21e887e285bb93b15f118d3842eed75a0d7c6dfc.png";

function MicroHeading() {
  return (
    <div className="h-[35px] relative rounded-[10px] shrink-0 w-[108.434px]" data-name="Micro Heading">
      <div className="box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[inherit] w-[108.434px]">
        <div className="flex flex-col font-['Effra_Trial:Regular',sans-serif] h-[60px] justify-center leading-[0] not-italic relative shrink-0 text-[#333333] text-[14px] text-center w-[238px]">
          <p className="leading-[76px]">Get started</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
      <MicroHeading />
      <div className="flex flex-col font-['Oxygen:Bold',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[64px] text-black tracking-[-2.56px] w-[min-content]">
        <p className="leading-[normal]">
          <span>{`Check your eligibility `}</span>
          <span className="text-[#0093d3]">today</span>
        </p>
      </div>
    </div>
  );
}

function LeftCol() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[23px] items-start left-[106px] overflow-clip px-0 py-[20px] top-[calc(50%-0.5px)] translate-y-[-50%] w-[473px]" data-name="Left Col">
      <Frame />
      <p className="font-['Oxygen:Regular',sans-serif] h-[232px] leading-[normal] not-italic relative shrink-0 text-[#333333] text-[24px] w-full">
        In just 5 minutes, you can find out if your company is eligible for Fitness Passport.
        <br aria-hidden="true" />
        <br aria-hidden="true" />
        {`You'll receive an instant result and guidance on what to do next.`}
      </p>
    </div>
  );
}

function RightCol() {
  return (
    <div className="absolute border border-[#dfdfdf] border-solid h-[581px] left-[618px] overflow-clip rounded-[25px] shadow-[0px_0px_32px_0px_rgba(0,0,0,0.15)] top-[calc(50%-0.5px)] translate-y-[-50%] w-[765px]" data-name="Right Col">
      <div className="absolute h-[530px] left-[2px] rounded-[15px] top-[4px] w-[754px]" data-name="image 83">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[15px]">
          <img alt="" className="absolute h-[102.08%] left-[-0.33%] max-w-none top-[-0.94%] w-[101.46%]" src={imgImage83} />
        </div>
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="h-[866px] overflow-clip relative shrink-0 w-[1440px]" data-name="Section">
      <div className="absolute h-[840px] left-0 top-0 w-[1439px]" data-name="Screenshot 2025-11-26 at 1.06.11 pm 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgScreenshot20251126At10611Pm1} />
      </div>
      <LeftCol />
      <RightCol />
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-[#f7f7f9] content-stretch flex flex-col items-center relative size-full" data-name="Page">
      <Section />
    </div>
  );
}