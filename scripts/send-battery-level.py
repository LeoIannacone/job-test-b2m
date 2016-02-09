from datetime import datetime
import time
import requests
import random
import argparse

HOST = "http://localhost:3000/api"


def get_data(timestamp, level):
    return {
        'object': 'battery',
        'method': 'setLow',
        'data': {
            'level': level,
            'timestamp': int(timestamp) * 1000,
            'deviceId': 'test'
        }
    }


def send_req(data):
    r = requests.post(HOST, json=data)
    if (r.status_code != 200):
        print(r.status_code, r.reason, r.text[:300] + '...')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--level', type=int, default=random.randint(1, 100),
                        help='level of battery, default=random(1, 100)')

    parser.add_argument('--date', default=time.strftime("%Y-%m-%d"),
                        help='date in form YYYY-MM-DD, default=today')

    args = parser.parse_args()
    level = args.level
    date_str = args.date
    timestamp = datetime\
        .strptime("{} 12:00".format(date_str), '%Y-%m-%d %H:%M')\
        .strftime("%s")
    print "Sending: level {} for {}".format(level, date_str)
    send_req(get_data(timestamp, level))


if __name__ == '__main__':
    main()
