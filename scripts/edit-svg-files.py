import os
import json
from xml.etree import ElementTree as ET

'''
Edit svg files

svg 파일들을 수정하는 스크립트
아이콘들을 일괄적으로 속성을 편집하기 위하여 만들어 졌습니다.
'''

ET.register_namespace('', 'http://www.w3.org/2000/svg')


'''
set variables
'''
# 편집할 svg 파일들의 경로
path = '../public/icons/'
# svg 파일들의 이름목록을 만들 json 파일 경로
path_fileNames = '../src/components/icons/svg-index.json'


'''
functions
'''

# processing svg file
def processing(path, id):
  tree = ET.parse(path)
  root = tree.getroot()
  # set id
  root.set('id', id)
  # remove attributes
  if 'width' in root.attrib: del root.attrib['width']
  if 'height' in root.attrib: del root.attrib['height']
  if 'class' in root.attrib: del root.attrib['class']
  if 'stroke-width' in root.attrib: del root.attrib['stroke-width']
  # write file
  tree.write(path)

def makeFileNameArrayFile(path, data):
  f = open(path, 'w+')
  data = json.dumps(data)
  f.write(data)
  f.close()


'''
actions
'''

# get files
files = os.listdir(path)
files.sort()
filesIndex = []

# processing files
for (idx,file) in enumerate(files):
  if not os.path.isdir(file):
    filename = os.path.splitext(file)
    if filename[1] == '.svg':
      filesIndex.append(filename[0])
      processing(path + file, 'icon_' + filename[0])
      print(idx, path + file)

# make array file
if len(filesIndex) > 0:
  makeFileNameArrayFile(path_fileNames, filesIndex)

# print last message
print('COMPLETE PROCESSING SVG FILES')
