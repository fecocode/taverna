import moment from 'moment'

export function parseFirestoreTimeStampFormatToDate(firestoreFormatedDate: {_seconds: number, _nanoseconds: number} | null) {
  if (firestoreFormatedDate) {
    return new Date(
      firestoreFormatedDate._seconds * 1000 + firestoreFormatedDate._nanoseconds / 1000000
    )
  } else {
    return null
  }
}

export function getTimeAgo(date: Date) {
  const now = moment();
  const duration = moment.duration(now.diff(date));
  const seconds = duration.asSeconds();
  const minutes = duration.asMinutes();
  const hours = duration.asHours();
  const days = duration.asDays();
  const months = duration.asMonths();
  const years = duration.asYears();

  if (seconds < 60) {
    return 'Ahora';
  } else if (minutes < 60) {
      return `Hace ${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? 'minuto' : 'minutos'}`;
  } else if (hours < 24) {
      return `Hace ${Math.floor(hours)} ${Math.floor(hours) === 1 ? 'hora' : 'horas'}`;
  } else if (days < 60) {
      return `Hace ${Math.floor(days)} ${Math.floor(days) === 1 ? 'dia' : 'dias'}`;
  } else if (months < 24) {
      return `Hace ${Math.floor(months)} ${Math.floor(months) === 1 ? 'mes' : 'meses'}`;
  } else {
      return `Hace ${Math.floor(years)} ${Math.floor(years) === 1 ? 'año' : 'años'}`;
  }
}