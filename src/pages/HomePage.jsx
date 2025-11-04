import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const slides = [
    'Create Memorable Events with Ease',
    'Plan Your Perfect Celebration',
    'Manage Guests and Invitations Effortlessly',
    'Track Your Event Budget in Real-Time',
    'Make Every Moment Count',
  ];

  const eventImages = [
    {
      id: 1,
      src: '../../public/assets/img/events/event_1.jpeg',
      title: 'Christmas Party Wonderland',
      description: 'A magical Christmas party with festive decorations and joyful moments'
    },
    {
      id: 2,
      src: '../../public/assets/img/events/event_2.jpeg',
      title: 'Corporate Conference',
      description: 'Professional business event with modern setup and networking opportunities'
    },
    {
      id: 3,
      src: '../../public/assets/img/events/event_3.jpeg',
      title: 'Birthday Party Extravaganza',
      description: 'Colorful and fun birthday celebration with amazing decorations'
    },
    {
      id: 4,
      src: '../../public/assets/img/events/event_4.jpeg',
      title: 'Charity Gala Evening',
      description: 'Sophisticated charity event with elegant atmosphere and noble cause'
    },
    {
      id: 5,
      src: '../../public/assets/img/events/event_5.jpeg',
      title: 'Product Launch Event',
      description: 'Innovative product presentation with modern technology and great audience'
    },
    {
      id: 6,
      src: '../../public/assets/img/events/event_6.jpeg',
      title: 'Garden Party Reception',
      description: 'Outdoor reception in beautiful garden setting with natural decorations'
    },
    {
      id: 7,
      src: '../../public/assets/img/events/event_7.jpeg',
      title: 'Halloween Bash',
      description: 'Spooky Halloween party with creative costumes and thrilling decorations'
    },
    {
      id: 8,
      src: '../../public/assets/img/events/event_8.jpeg',
      title: 'Garden Party Reception',
      description: 'Outdoor reception in beautiful garden setting with natural decorations'
    },
    {
      id: 9,
      src: '../../public/assets/img/events/event_9.jpeg',
      title: 'Elegant Wedding Celebration',
      description: 'A beautiful outdoor wedding with stunning decorations and memorable moments'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselSlide((prev) => (prev + 1) % eventImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [eventImages.length]);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const nextCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev + 1) % eventImages.length);
  };

  const prevCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev - 1 + eventImages.length) % eventImages.length);
  };

  const goToCarouselSlide = (index) => {
    setCurrentCarouselSlide(index);
  };

  const handleTestimonialInputChange = (e) => {
    const { name, value } = e.target;
    setTestimonialForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (ratingValue) => {
    setRating(ratingValue);
    setTestimonialForm(prev => ({
      ...prev,
      rating: ratingValue
    }));
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.message || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    
    // Симуляція відправки на сервер
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setTestimonialForm({
        name: '',
        email: '',
        message: '',
        rating: 0
      });
      setRating(0);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <section id="home" className="hero-container">
          <div className="hero-content">
            <div className="slider">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <h2 className="neon">{slide}</h2>
                </div>
              ))}
            </div>
          </div>
        </section>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#667eea" fillOpacity="1" d="M0,128L40,122.7C80,117,160,107,240,122.7C320,139,400,181,480,192C560,203,640,181,720,165.3C800,149,880,139,960,160C1040,181,1120,235,1200,256C1280,277,1360,267,1400,261.3L1440,256L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>

        <section id="statistics" className="stats-section">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">15,247</div>
              <div className="stat-label">Events Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">12,500+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Countries Served</div>
            </div>
          </div>
        </section>

        <section id="create-event" className="cta-section">
          <div className="cta-container">
            <h2 className="cta-title">Готові створити незабутній івент?</h2>
            <p className="cta-description">
              Розпочніть планування вашого ідеального заходу за декілька простих кроків
            </p>
            <button className="cta-button" onClick={handleCreateEvent}>
              <span className="cta-icon">✨</span>
              Створити івент
            </button>
          </div>
        </section>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ transform: 'scaleY(-1)' }}>
          <path fill="#667eea" fillOpacity="1" d="M0,128L40,122.7C80,117,160,107,240,122.7C320,139,400,181,480,192C560,203,640,181,720,165.3C800,149,880,139,960,160C1040,181,1120,235,1200,256C1280,277,1360,267,1400,261.3L1440,256L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>

        <section id="testimonials" className="testimonials-section">
          <div className="testimonials-container">
            <h2 className="testimonials-title">Що кажуть наші клієнти</h2>
            <div className="testimonials-grid">
              <div className="testimonial-item">
                <div className="testimonial-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">
                  "Найкращий сервіс для організації заходів! Все пройшло на вищому рівні. Команда професійна, уважна до деталей."
                </p>
                <p className="testimonial-author">- Олена К.</p>
              </div>
              <div className="testimonial-item">
                <div className="testimonial-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">
                  "Дуже задоволені співпрацею. Рекомендуємо всім! Організація була бездоганною."
                </p>
                <p className="testimonial-author">- Ігор П.</p>
              </div>
              <div className="testimonial-item">
                <div className="testimonial-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">
                  "Фантастичний досвід! Наша весілля пройшла просто ідеально завдяки вашій команді."
                </p>
                <p className="testimonial-author">- Марія Т.</p>
              </div>
            </div>

            <div className="events-carousel-section">
              <h3 className="events-carousel-title">Наші незабутні події</h3>
              <div className="carousel-container">
                <div className="carousel-wrapper">
                  {eventImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`carousel-slide ${
                        index === currentCarouselSlide 
                          ? 'active' 
                          : index === (currentCarouselSlide - 1 + eventImages.length) % eventImages.length 
                            ? 'prev' 
                            : ''
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="carousel-image"
                        onError={(e) => {
                          // Fallback to a gradient background if image fails to load
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = `linear-gradient(135deg, #667eea, #764ba2)`;
                          e.target.parentElement.style.display = 'flex';
                          e.target.parentElement.style.alignItems = 'center';
                          e.target.parentElement.style.justifyContent = 'center';
                          e.target.parentElement.innerHTML = `<div style="text-align: center; color: white;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
                            <div style="font-size: 1.5rem; font-weight: bold;">${image.title}</div>
                          </div>`;
                        }}
                      />
                      <div className="carousel-overlay">
                        <h4 className="carousel-caption">{image.title}</h4>
                        <p className="carousel-description">{image.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    className="carousel-controls carousel-prev"
                    onClick={prevCarouselSlide}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  
                  <button 
                    className="carousel-controls carousel-next"
                    onClick={nextCarouselSlide}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                  
                  <div className="carousel-indicators">
                    {eventImages.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-indicator ${index === currentCarouselSlide ? 'active' : ''}`}
                        onClick={() => goToCarouselSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-form-section">
              <h3 className="testimonial-form-title">Поділіться своїм відгуком</h3>
              <form onSubmit={handleTestimonialSubmit} className="testimonial-form">
                <div className="form-row-testimonial">
                  <div className="testimonial-form-group">
                    <label htmlFor="name">Ім'я *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={testimonialForm.name}
                      onChange={handleTestimonialInputChange}
                      required
                      placeholder="Введіть ваше ім'я"
                    />
                  </div>
                  <div className="testimonial-form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={testimonialForm.email}
                      onChange={handleTestimonialInputChange}
                      placeholder="Введіть ваш email"
                    />
                  </div>
                </div>
                
                <div className="testimonial-form-group">
                  <label>Оцініть наш сервіс *</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`rating-star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="testimonial-form-group">
                  <label htmlFor="message">Ваш відгук *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={testimonialForm.message}
                    onChange={handleTestimonialInputChange}
                    required
                    placeholder="Розкажіть про ваш досвід співпраці з нами..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-testimonial-btn"
                  disabled={isSubmitting || !testimonialForm.name || !testimonialForm.message || rating === 0}
                >
                  {isSubmitting ? 'Відправляємо...' : 'Відправити відгук'}
                </button>

                {submitSuccess && (
                  <div className="success-message">
                    Дякуємо за ваш відгук! Він допоможе нам стати кращими.
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        <section id="contacts" className="footer-section">
          <div className="footer-container">
            <p className="footer-text">E-mail: anastasia.polyatskovaya@gmail.com</p>
            <p className="footer-text">Created by Anastasiia Verbivska</p>
            <p className="footer-text">© 2025 Event Manager. All rights reserved.</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;