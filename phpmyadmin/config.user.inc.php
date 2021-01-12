<?php

  $i++;
  $cfg['Servers'][$i]['verbose'] = 'market-service';
  $cfg['Servers'][$i]['host'] = 'marketdb';
  $cfg['Servers'][$i]['port'] = '';
  $cfg['Servers'][$i]['socket'] = '';
  $cfg['Servers'][$i]['connect_type'] = 'tcp';
  $cfg['Servers'][$i]['extension'] = 'mysqli';
  $cfg['Servers'][$i]['auth_type'] = 'config';
  $cfg['Servers'][$i]['user'] = 'marketdbuser';
  $cfg['Servers'][$i]['password'] = '123marketdbuser123a';
  $cfg['Servers'][$i]['AllowNoPassword'] = false;


  $i++;
  $cfg['Servers'][$i]['verbose'] = 'auth-service';
  $cfg['Servers'][$i]['host'] = 'authdb';
  $cfg['Servers'][$i]['port'] = '';
  $cfg['Servers'][$i]['socket'] = '';
  $cfg['Servers'][$i]['connect_type'] = 'tcp';
  $cfg['Servers'][$i]['extension'] = 'mysqli';
  $cfg['Servers'][$i]['auth_type'] = 'config';
  $cfg['Servers'][$i]['user'] = 'authdbuser';
  $cfg['Servers'][$i]['password'] = '123authdbuser123a';
  $cfg['Servers'][$i]['AllowNoPassword'] = false;
