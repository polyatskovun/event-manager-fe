import Header from '../components/common/Header';
import EventWizard from '../components/events/EventWizard';

const CreateEventPage = () => {
  return (
    <>
      <Header />
      <div className="create-event-page">
        <EventWizard />
      </div>
    </>
  );
};

export default CreateEventPage;
