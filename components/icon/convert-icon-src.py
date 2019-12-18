import os
import sys
import json

'''
Convert icon svg to vue

svg 파일을 vue 파일로 바꿔주는 스크립트입니다.
변환작업이 좀 많은편이라서 파이썬으로 스크립트를 작성하게 되었습니다.

먼저 `./src` 경로속에 `svg`파일들을 집어넣습니다.
그리고 다음과 같이 스크립트를 실행하면 `svg` 파일들은 `vue`파일로 변환되고, `./src/index.json`파일이 만들어집니다.
'''

# change filename
def changeFilename(path, name, rename):
  os.rename(path+name, path+rename)

# edit file
def editFile(path, words):
  # open file
  f = open(path, 'r')
  bodyText = f.read()
  combineText = words[0] + bodyText + words[1]
  f.close()
  # write file
  f = open(path, 'w')
  f.write(combineText)
  f.close()

def makeFileNameArrayFile(path, filename, data):
  f = open(path+filename, 'w+')
  data.sort()
  data = json.dumps(data)
  f.write(data)
  f.close()


# set path
path = './src/'
# icons index filename
indexFileName = 'index.json'
# set extension
changeExt = '.vue'
# set edit text
combineTexts = [
  '<template>\n',
  '\n</template>',
]
filesName = []

# get files
files = os.listdir(path)

# processing files
for file in files:
  if not os.path.isdir(file):
    filename = os.path.splitext(file)
    if filename[1] == '.svg':
      filesName.append(filename[0])
      editFile(path+filename[0]+filename[1], combineTexts)
      changeFilename(path, filename[0]+filename[1], filename[0]+changeExt)
      print('change file::', path+filename[0]+changeExt)

# make array file
if len(filesName) > 0:
  makeFileNameArrayFile(path, indexFileName, filesName)

# print last message
print('COMPLETE CONVERT ICON FILES')
