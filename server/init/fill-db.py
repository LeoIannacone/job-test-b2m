from datetime import datetime
import requests
import random
from threading import Thread

HOST = "http://localhost:3000/api"

# min and max reqs per day
MIN_REQ = 15
MAX_REQ = 150

YEARS = [2013, 2014, 2015]


def get_data(year, month, day):
    return {
        'object': 'battery',
        'method': 'setLow',
        'data': {
            'level': random.randint(0, 100),
            'timestamp': int(datetime(year, month, day).strftime("%s")) * 1000,
            'deviceId': 'test'
        }
    }


def send_req(data):
    r = requests.post(HOST, json=data)
    if (r.status_code != 200):
        print(r.status_code, r.reason, r.text[:300] + '...')


def get_num_of_days_per_month(month):
    if month is 2:
        return 28
    if month in [4, 6, 9, 11]:
        return 30
    return 31


def main():
    for year in YEARS:
        for month in xrange(1, 12 + 1):
            pool = []
            for day in xrange(1, get_num_of_days_per_month(month) + 1):
                reqs = random.randint(MIN_REQ, MAX_REQ)
                for i in xrange(1, reqs + 1):
                    data = get_data(year, month, day)
                    thread = Thread(target=send_req, args=(data, ))
                    pool.append(thread)
                    thread.start()

                print(year, month, day, "reqs", reqs)
            for t in pool:
                t.join()


if __name__ == '__main__':
    main()
