import pytz

class GlobalSettings:
    deployed_timezone = 'US/Eastern'
    host = 'nona_db-1'
    # host = 'localhost'
    cred_path = 'files/private/cred.json'
    # host = 'home.magicspica.com'
    upload_folder = 'files/public/upload/images/'
    max_image_size = 16 * 1000 * 1000 # 16M

    def utc_to_tz(utc_time):
        return utc_time.replace(tzinfo=pytz.timezone('UTC')).astimezone(pytz.timezone(GlobalSettings.deployed_timezone)).replace(tzinfo=None)
