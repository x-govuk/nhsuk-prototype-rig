import test from 'ava'
import {
  govukDate,
  govukTime,
  isoDateFromDateInput
} from '../../../lib/filters/date.js'

test('Converts an ISO 8601 datetime to a date using the GOV.UK style', t => {
  t.is(govukDate('2021-08-17'), '17 August 2021')
  t.is(govukDate('2021-08-17', 'truncate'), '17 Aug 2021')
  t.is(govukDate('2021-08'), 'August 2021')
  t.is(govukDate('2021-08', 'truncate'), 'Aug 2021')

  const now = new Date()
  const govukDateToday = new Date(govukDate('today'))
  t.is(govukDateToday.getDate(), now.getDate())
  t.is(govukDateToday.getMonth(), now.getMonth())
  t.is(govukDateToday.getFullYear(), now.getFullYear())

  const govukDateTodayTruncated = new Date(govukDate('today', 'truncate'))
  t.is(govukDateTodayTruncated.getDate(), now.getDate())
  t.is(govukDateTodayTruncated.getMonth(), now.getMonth())
  t.is(govukDateTodayTruncated.getFullYear(), now.getFullYear())
})

test('Returns error converting an ISO 8601 datetime to a date using the GOV.UK style', t => {
  t.is(govukDate('2021-23-45'), 'Invalid DateTime')
})

test('Converts an ISO 8601 datetime to a time using the GOV.UK style', t => {
  t.is(govukTime('2021-08-17T18:30:00'), '6:30pm')
  t.is(govukTime('2021-08-17T00:00:59'), 'midnight')
  t.is(govukTime('2021-08-17T12:00:59'), 'midday')
  t.is(govukTime('18:30'), '6:30pm')
})

test('Returns error converting an ISO 8601 datetime to a time using the GOV.UK style', t => {
  t.is(govukTime('2021-08-17T25:61:00'), 'Invalid DateTime')
})

test('Converts decorated `govukDateInput` values to an ISO 8601 date', t => {
  t.is(isoDateFromDateInput({
    day: '17',
    month: '08',
    year: '2021'
  }), '2021-08-17')
  t.is(isoDateFromDateInput({
    month: '08',
    year: '2021'
  }), '2021-08')
})

test('Doesn’t covert value to an ISO 8601 date if not an object', t => {
  t.is(isoDateFromDateInput('2021-08-17T12:49:05'), '2021-08-17T12:49:05')
})

test('Returns error converting decorated `govukDateInput` values to an ISO 8601 date', t => {
  t.is(isoDateFromDateInput({ foo: 'bar' }), 'Invalid DateTime')
})
