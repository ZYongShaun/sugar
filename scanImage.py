# coding=utf-8

import os
import sys
import re
import json

base_path = sys.path[0]
scan_path = base_path + '/' + '_posts'
img_list = []


def scan_dir():
    for file_name in os.listdir(scan_path)[::-1]:
        read_file(scan_path + '/' + file_name)
    output_file()


def read_file(file_path):
    _file = open(file_path, 'r')
    for line in _file.readlines():
        operate_line(line)
    _file.close()


def operate_line(line):
    regex1 = re.compile('(<img src=")|(!\[\]\()')
    regex2 = re.compile('http://o84gzkc9y.bkt.clouddn.com/\S*')
    if regex1.search(line):
        match = regex2.search(line)
        if match:
            img_list.append(match.group(0)[0:-1])


def output_file():
    json_file = open(base_path + '/imgList.json', 'w')
    json_file.write(json.dumps(img_list))


scan_dir()
