from datetime import datetime, timedelta
import random
import string

random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=24))
label = ["normal", "fraud"]

def random_date(start, end):
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))
