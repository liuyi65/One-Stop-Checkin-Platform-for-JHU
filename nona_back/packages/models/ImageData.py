import os
import pathlib
from werkzeug.utils import secure_filename
from .APIModelException import APIModelException
from ..utils.GlobalSettings import GlobalSettings
from PIL import Image
import uuid

ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']

class ImageData:
    def __init__(self, flask_image, path_prefix=None):
        self.flask_image = flask_image
        self.img = Image.open(flask_image)
        filename = secure_filename(flask_image.filename)

        suffix = pathlib.Path(filename).suffix
        if suffix not in ALLOWED_EXTENSIONS:
            raise APIModelException('file extension not allowed')
        
        try:
            img = Image.open(flask_image)
            img.verify()
        except:
            raise APIModelException('file is not image')
        flask_image.seek(0)

        hashed_filename = str(uuid.uuid4())
        self.filename = hashed_filename + suffix
        if path_prefix is not None:
            self.path = os.path.join(GlobalSettings.upload_folder, path_prefix, self.filename)
        else:
            self.path = os.path.join(GlobalSettings.upload_folder, self.filename)

    def save(self, prev_path=None):
        if prev_path is not None:
            try:
                os.remove(prev_path)
            except:
                print('file remove error')
        try:
            if not os.path.exists(os.path.dirname(self.path)):
                os.makedirs(os.path.dirname(self.path))
            try:
                self.flask_image.save(self.path)
            except:
                self.img.save(self.path)
        except:
            raise APIModelException('file save error')

        