const NewsFeedBanner = () => {
  return (
    <div className="news-feed-banner w-full bg-cyan-800 text-white py-2">
      <div className="overflow-x-hidden">
        <div className="flex flex-row">
          <div
            dir="rtl"
            className="animate-marqueertl whitespace-nowrap space-x-2 rtl"
          >
            <span className="text-4xl font-bold text-cyan-500 mx-4 px-2">
              مركز الرعاية الطبية الشرافي غيسوندبرونن
            </span>
            <span className="text-4xl mx-4 rtl">
              يسرنا أن نعلن عن انضمام أخصائي في الطب فيزيائي وإعادة التأهيل إلى
              فريقنا اعتباراً من 1 يونيو 2024.
            </span>
          </div>
          <div
            dir="ltr"
            className="animate-marquee whitespace-nowrap space-x-2 ltr"
          >
            <span className="text-4xl font-bold text-cyan-500 mx-4">
              MVZ El-Sharafi Gesundbrunnen
            </span>
            <span className="text-4xl mx-4">
              Wir freuen uns, Ihnen mitteilen zu können, dass ab dem 01. Juni
              2024 ein Facharzt für physikalische Medizin und Rehabilitation
              unser Team verstärken wird.
            </span>
            <span className="text-4xl font-bold text-cyan-500 mx-4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeedBanner;
