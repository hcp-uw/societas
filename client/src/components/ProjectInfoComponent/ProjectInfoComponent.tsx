import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ProjectInfoComponent.css';

dayjs.extend(relativeTime);

const ProjectInfoComponent = ({ data, labels, imageUrls, user}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="project-container">
        {/* Left side with Image */}
        <div style={{ flexBasis: '50%' }} className='left-side'>
          <ImageSlider images={imageUrls} />
        </div>

        {/* Right side with Title, Format, Time, etc. */}
        <div style={{ flexBasis: '50%', marginLeft: '30px'}} className='right-side'>
            <h1 style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '30px'}}>{data.name}</h1>
            <p style={{marginBottom: '24px' }}>{data.description}</p>
            <h2 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Format</h2>
            <p style={{ marginBottom: '12px' }}>{data.meetType}</p>
            <h2 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Location</h2>
            <p style={{ marginBottom: '12px' }}>{data.meetLocation}</p>
            <h2 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Time</h2>
            <p style={{ marginBottom: '12px' }}>{dayjs(data.createdAt).format('h:mm A')}</p>
            
          
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {labels.map((label, index) => (
              <span key={index} style={{
                display: 'inline-block',
                backgroundColor: label.color, 
                borderRadius: '20px',
                padding: '5px 15px',
                color: 'black', 
                fontSize: '12px'
              }}>
                {label.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <h1 style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '20px'}}>Organizer</h1>


      <div className="user-profile">
        <img
            src={user.imageUrl}
            alt={`${user.fullName} profile image`}
            className="rounded-full object-cover w-14 h-14"
        />
        <div className="user-details">
          <div className="user-username">{user.username}</div>
          <p>{user.fullName}</p>
        </div>
      </div>

      <h1 style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '20px'}}>Project Blogs</h1>

      {/* <div className="user-profile">
        <img
          src={user.imageUrl}
          alt={`${user.fullName} profile image`}
          className="user-image"
        />
        <div className="user-details">
          <div className="user-username">{user.username}</div>
          <div>{user.fullName}</div>
        </div>
      </div> */}

      {/* <h1 style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '20px'}}>Project Blog</h1>
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        minHeight: '100px',
        marginTop: '15px',
      }}>
        <p>Post your thoughts here...</p>
      </div> */}

     
    </div>
  );
};

const ImageSlider = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };
    
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{
              ...style,
              display: "block",
              position: "absolute",
              top: "50%",
              right: "20px",
              zIndex: 1,
              transform: "translate(0, -50%)",
              fontSize: "30px",
            }}
            onClick={onClick}
          />
        );
      }
      

      function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{
              ...style,
              display: "block",
              position: "absolute",
              top: "50%",
              left: "10px",
              zIndex: 1,
              transform: "translate(0, -50%)",
              fontSize: "30px",
            }}
            onClick={onClick}
          />
        );
      }
  
    return (
      <div style={{ width: '400px', height: '300px', marginBottom: '30px', position: 'relative'}}>
        <Slider {...settings}>
          {images.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`Slide ${idx}`} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '15px'}} />
            </div>
          ))}
        </Slider>
      </div>
    );
  };
  

export default ProjectInfoComponent;
