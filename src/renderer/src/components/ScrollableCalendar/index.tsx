import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import dayjs from 'dayjs';

interface ScrollableCalendarProps {
  initialDate: dayjs.Dayjs;
  onChangeDate: (date: Date) => void;
}

const ScrollableCalendar = ({
  initialDate,
  onChangeDate
}: ScrollableCalendarProps): JSX.Element => {
  const startOfYear = dayjs(initialDate).startOf('year');
  const dates = Array.from({ length: initialDate.diff(startOfYear, 'day') + 1 }, (_, i) =>
    startOfYear.add(i, 'day')
  );

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedDateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, top: scrollRef.current.scrollHeight });
    }
  }, []);

  useEffect(() => {
    if (selectedDateRef.current) {
      const scrollPosition =
        selectedDateRef.current.offsetTop -
        (scrollRef.current?.clientHeight ?? 0) / 2 +
        selectedDateRef.current.offsetHeight / 2;
      scrollRef.current?.scrollTo({ left: 0, top: scrollPosition, behavior: 'smooth' });
    }
  }, [selectedDate]);

  const handleChangeDate = (date: dayjs.Dayjs): void => {
    setSelectedDate(date);
    onChangeDate(date.toDate());
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollableCalendar} ref={scrollRef}>
        {dates.map((date, index) => (
          <div
            key={index}
            className={`${styles.date} ${selectedDate.isSame(date, 'day') && styles.dateSelected}`}
            onClick={() => handleChangeDate(date)}
            ref={selectedDate.isSame(date, 'day') ? selectedDateRef : null}
          >
            {date.date()}
          </div>
        ))}
      </div>
      <div className={styles.caption}>{selectedDate.format('MMM YY')}</div>
    </div>
  );
};

export default ScrollableCalendar;
