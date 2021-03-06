---
title: Drupal Modules with Known Issues
description: A list of Drupal modules that are not supported and/or require workarounds.
tags: [debugcode, siteintegrations]
categories: [troubleshoot, integrate]
---

This page lists modules that may not function as expected or are currently problematic on the Pantheon platform. This is not a comprehensive list (see [other issues](#other-issues)). We continually update it as problems are reported and/or solved. If you are aware of any modules that do not work as expected, please [contact support](/support).

We do not prevent you from installing and using these plugins/modules. However, we cannot provide support for incompatible modules, or if they are used against the guidance provided here.

**Module Maintainers:** If your work is listed here, please [reach out to us](https://github.com/pantheon-systems/documentation/issues/new?title=Modules%20and%20Plugins%20with%20Known%20Issues%20Doc%20Update%20&body=Re%3A%20%5BModules%20and%20Plugins%20with%20Known%20Issues%5D(https%3A%2F%2Fpantheon.io/docs/modules-plugins-known-issues/)%0A%0APriority%20(Low%E2%80%9A%20Medium%E2%80%9A%20High)%3A%0A%0A%23%23%20Issue%20Description%3A%0A%0A%23%23%20Suggested%20Resolution%20&labels=fix%20content). We're happy to help provide information that can lead to conflict resolutions between your code and the platform.

If your work is already updated but still listed here, let us know so we can remove it, or [submit a pull request](https://github.com/pantheon-systems/documentation/edit/master/source/_docs/modules-plugins-known-issues.md).

___

## [APC - Alternative PHP Cache](https://www.drupal.org/project/apc)

**Issue**: APC is in-memory and limited to a single instance. It cannot span multiple server environments.

**Solution**: Pantheon recommends Redis as a caching backend, which has better performance.
___

## [Adaptive Image Styles](https://www.drupal.org/project/ais)

**Issue**: This module requires edits to the `nginx.conf` which is not currently supported on the platform. See [Platform Considerations](/platform-considerations/#nginx.conf) and [https://www.drupal.org/node/1669182](https://www.drupal.org/node/1669182).
___

## [Apache Solr Multilingual](https://www.drupal.org/project/apachesolr_multilingual)

**Issue**: When the Apache Solr Multilingual module is enabled, the default class variable set by the Pantheon Apache Solr module is changed, and the site will be unable to connect to the Solr server.

If you have already enabled the Apache Solr Multilingual module and found that your site can no longer connect to the Solr server, you will need to first disable and uninstall the module. Next, disable and re-enable the Pantheon Apache Solr module. This will add the class variable back so your site can connect to the Solr server again.
___

## [Acquia Search](https://www.drupal.org/project/acquia_search)

**Issue**: If Acquia Solr modules are present in the site codebase (even if disabled) and Pantheon Apache Solr is enabled, the site will be unable to connect to Solr server.

**Solution**: Delete the Acquia Solr modules from the codebase and then disable and re-enable the Pantheon Apache Solr module.
___

## [Background Process](https://www.drupal.org/project/background_process)

**Issue**: The module allows for Drupal to perform "parallel" (asynchronous non-blocking mode) requests. However, there are a number of limitations working in a distributed environment and function correctly on the platform. See [https://www.drupal.org/node/2233843](https://www.drupal.org/node/2233843).

___

## [Backup and Migrate](https://www.drupal.org/project/backup_migrate)

**Issue**: The Backup and Migrate module can create large archives and cause issues with the tools in the Database / Files tab of the Dashboard. See [Backup Creation](/backups/#why-is-the-drupal-module-backup-%26-migrate-not-recommended-on-pantheon%3F).

**Solution**: You can use the automated backups that are available on the Dashboard for each environment. If you want to access your backups and copy it to your own repository (Amazon S3, FTP server, etc), consider using a bash script. You can do that by running it in your local system, or use an external server, or a service that runs cron jobs for you. See [Access Backups](/backups/#access-backups) for more details.

___

## [Basic HTTP Authentication](https://www.drupal.org/project/basic_auth) - Drupal 7 only

**Issue**: This contrib module conflicts with [Pantheon's Security tool](/security/#password-protect-your-site%27s-environments) when both are enabled on Drupal 7 sites, resulting in 403 errors.

**Solution**: Lock the environment via Pantheon's Security tool or via the module, not both. For details, see [Security on the Pantheon Dashboard](/security/#troubleshoot).

___

## [BigPipe](https://www.drupal.org/documentation/modules/big_pipe)

<ReviewDate date="2018-04-22" />

**Issue**: The Pantheon Edge layer buffers text output, and BigPipe depends on being able to stream text output. Since BigPipe provides no benefit on Pantheon sites, we recommend disabling it.

___

## [Boost](https://www.drupal.org/project/boost)

**Issue**: Boost is an unnecessary caching layer that may cause issues. Every site on Pantheon can leverage our robust page caching infrastructure that returns pages for anonymous visitors at the highest possible performance. See [Pantheon's Global CDN](/global-cdn).

___

## [Cache Expiration](https://www.drupal.org/project/expire)

**Issue**: This module doesn't support Pantheon's granular cache clearing and header system.

**Solution**: Install the [Pantheon Advanced Page Cache module](/modules/#advanced-page-cache) to dynamically purge content from cache on content update.

___

## [Composer Manager](https://www.drupal.org/project/composer_manager)

This module has been deprecated by its authors. The suggestions made below are not guaranteed to be successful in all use cases.

**Issue**: Composer Manager expects write access to the site's codebase via SFTP, which is prevented in Test and Live environments on Pantheon by design.

**Solution**: As suggested within the [module documentation](https://www.drupal.org/node/2405805), manage dependencies in Dev exclusively. Place the following configuration within `settings.php` to disable autobuild on Pantheon. This will also set appropriate file paths for Composer so that checks to see if the path is writable will not fail. Packages, however, are stored within the root directory of the site's codebase and version controlled:

```php:title=settings.php
if (isset($_ENV['PANTHEON_ENVIRONMENT'])) {
    # Set appropriate paths for Composer Manager
    $conf['composer_manager_file_dir'] = 'private://composer';
    $conf['composer_manager_vendor_dir'] = $_SERVER['HOME'] . '/code/vendor';
    # Disable autobuild on Pantheon
    $conf['composer_manager_autobuild_file'] = 0;
    $conf['composer_manager_autobuild_packages'] = 0;
}
```

You also need to create the directory path `sites/default/files/private/composer`.

This disables auto-building in all Pantheon environments. This will allow Drush commands such as `pm-enable` and `pm-disable` to function correctly in both Git and SFTP modes as Composer Manager will only update packages and the autoloader when _explicitly_ told to do so via `drush composer-manager [COMMAND] [OPTIONS]` or `drush composer-json-rebuild`. This is the setting recommended by Pantheon.  While `composer.json` can be rebuilt via [Terminus](/terminus) while the DEV site is in SFTP mode, `composer install` must be run locally, committed via Git, and pushed back to Pantheon.

___

## [Fast 404](https://www.drupal.org/project/fast_404)

<ReviewDate date="2018-06-22" />

**Issue**: Database connection credentials are needed before Drupal bootstrap is invoked and standard MySQL is port hard-coded.

**Solution**: Pressflow settings can be [decoded in settings.php](/read-environment-config) to provide database credentials, but the module needs to be modified manually to use `$_ENV(["DB_PORT"])`.

Alternatively, [Drupal 7](https://github.com/pantheon-systems/drops-7/blob/7.59/sites/default/default.settings.php#L518) and [Drupal 8](https://github.com/pantheon-systems/drops-8/blob/8.5.4/sites/default/default.settings.php#L640) cores provide a basic version of this same feature via configuration in `settings.php`.

___

## [Front](https://www.drupal.org/project/front)

<ReviewDate date="2018-01-03" />

**Issue**: The Drupal 7 version of the module disables caching for the front page.

**Solution**: [Apply a patch to the module](https://www.drupal.org/project/front/issues/1854300#comment-12405090) to allow caching for anonymous users. Note that this patch doesn't work with the **Full** or **Redirect** options.

___

## [H5P](https://www.drupal.org/project/h5p)

<Partial file="h5p-known-issues.md" />

___

## [Honeypot http:BL](https://www.drupal.org/project/httpbl)

<ReviewDate date="2019-07-10" />

**Issue**: http:BL only has a module to take advantage of the service for Apache. Pantheon runs on nginx webservers and Apache modules are not compatible with the Platform.

___

## [HTTP Basic Authentication](https://www.drupal.org/docs/8/core/modules/basic_auth) - Drupal 8 (core)

 **Issue**: This Drupal 8 core module conflicts with [Pantheon's Security tool](/security/#password-protect-your-site%27s-environments) when both are enabled, resulting in 403 errors.

 **Solution**: Lock the environment via Pantheon's Security tool or via the module, not both. For details, see [Security on the Pantheon Dashboard](/security/#troubleshoot).

___

## [HTTPRL - HTTP Parallel Request & Threading Library](https://www.drupal.org/project/httprl)

**Issue**: This module can severely impact performance. This may be the result of module code or its configuration on the platform that results in the spikes.

___

## [ImageAPI Optimize](https://www.drupal.org/project/imageapi_optimize)

<ReviewDate date="2019-10-17" />

**Issue**: ImageAPI Optimize supports 3rd party libraries such as advpng, OptiPNG, PNGCRUSH, jpegtran, jfifremove, advdef, pngout, jpegoptim. These libraries have to be installed on the server. At this time, they are not supported.

**Solution**: Use a 3rd-party module like [reSmush.It](https://www.drupal.org/project/resmushit) or a local application like [ImageOptim.](https://imageoptim.com) or [OptiPNG](http://optipng.sourceforge.net/).

___

## [JS](https://www.drupal.org/project/js)

<ReviewDate date="2019-07-24" />

**Issue**: This module requires modification of the site's `.htaccess` or `nginx.conf` file, which cannot be modified on the platform. While using `settings.php` can sometimes be effective as a means of implementing redirects, because `POST` data needs to be preserved, it is not possible to implement redirects at the application layer in a way that would allow this module to function as intended.
___

## [LiveReload](https://www.drupal.org/project/livereload)

**Issue**: This module triggers heavy load on the application container as soon as it is enabled and causes pages to time out for anonymous users for Drupal 7 and Drupal 8.

___

## [Live CSS](https://www.drupal.org/project/live_css)

**Issue**: This module requires write access to the site's codebase for editing CSS files, which is not granted on Test and Live environments by design.

___

## [Media: Browser Plus](https://www.drupal.org/project/media_browser_plus)

**Issue**:  This module requires the use of the `/tmp` directory. See [Using the tmp Directory](#using-the-tmp-directory) section below.

___

## [Node export webforms](https://www.drupal.org/project/node_export_webforms)

**Issue**:  This module requires the use of the `tmp` directory. See [Using the tmp Directory](#using-the-tmp-directory) section below.

**Solution**: Use [drush](https://drushcommands.com/drush-8x/webform/webform-export/), as this uses a single application container to process the export. The relevant drush command is `webform-export` (alias wfx).

Customers have also reported success by making the export path [configurable](https://www.drupal.org/node/2221651).
___

## [Node Gallery](https://www.drupal.org/project/node_gallery)

**Issue**: Using Node Gallery with Plupload attaches cookies to image uploads for authentication purposes. This conflicts with our page cache configuration as we strip all cookies for images, CSS, and JS files to improve performance.
___

## [Pathologic](https://www.drupal.org/project/pathologic)

 **Issue**: The path of the base URL is changed and cached by the module itself.

 **Solution**: The [documentation on Drupal.org](https://drupal.org/node/257026) for the module mentions the issues and the remedy, which is a cache clear operation. If you are unable to exclude cached data from your dumps or avoid migrating cache data, you should clear your site's cache after importing the data.

 Additionally, Pathologic can cause the change of base URLs in a domain access configuration based on the value of `$options['url']` in the site Drush config. This is set to the first domain listed on an environment by default on Pantheon, which can result in unexpected root domains being written to the cache. See [our Drush documentation](/drush/#known-limitations) for more information about overriding this value.

## [Persistent Login](https://www.drupal.org/project/persistent_login)

**Issue**: This module attaches per-user cookies that conflict with our page cache configuration.

**Solution**: Follow the remedy provided within the [module's documentation of the issue on Drupal.org](https://www.drupal.org/node/1306214), which is to alter the code to prefix the cookie name with `SESS`.
 ___

## [Plupload](https://www.drupal.org/project/plupload)

**Issue**: This module requires the use of the `/tmp` directory. See [Using the tmp Directory](#using-the-tmp-directory) section below.

**Solution**: A possible solution is to set the `plupload_temporary_uri` variable in `settings.php`. Example:

```php:title=setting.php
$conf['plupload_temporary_uri'] ='private://tmp';
```

You may also need to add this line within the `filefield_sources_plupload.module` file to run through `files/private/tmp` every few hours and delete old files to keep it from piling up:

```php:title=filefield_sources_plupload.module
$temp_destination = file_stream_wrapper_uri_normalize('private://tmp/' . $filename);
```

This will move the temporary upload destination from the individual server mount `tmp` directory to the shared `mount tmp files/private/tmp directory`, which should preserve the files between requests.
___

## [reCAPTCHA](https://www.drupal.org/project/recaptcha)

**Issue 1:** If your site is running PHP 5.3, form submissions that use the reCAPTCHA module might continually fail and display the error: `The answer you entered for the CAPTCHA was not correct`. This is because the default arg_separator.output for PHP 5.3 is `&amp;` while for PHP 5.5 it is `&`.

**Solution:** Override the default arg_separator.output value in `settings.php` by adding the following line:

```php:title=settings.php
ini_set('arg_separator.output', '&');
```

___

**Issue 2:** On non-live environments, reCAPTCHA returns the error, "ERROR for site owner: Invalid domain for site key."

**Solution:** Add more domains to your Google reCAPTCHA configuration. Add `dev-<sitename>.pantheonsite.io` and `test-<sitename>.pantheonsite.io` to the site. This is set in [Google's reCAPTCHA admin panel](https://www.google.com/recaptcha/admin).

**Solution 2:** Disable the reCAPTCHA on non-live environments. In Drupal 7, you can set the configuration key to be `NULL` in your `settings.php` file as follows:

```php:title=settings.php
// Deactivate reCAPTCHA not running on the live site.
if (defined('PANTHEON_ENVIRONMENT') && $_ENV['PANTHEON_ENVIRONMENT'] != 'live') {
  $conf['recaptcha_site_key'] = NULL;
}
```
___

## [S3 File System](https://www.drupal.org/project/s3fs)

<ReviewDate date="2019-12-06" />

**Issue 1:** When the module is configured to take over the public file system, Drupal's CSS/JS aggregation will not work unless you also upload Drupal Core and contrib modules to S3. See [Drupal Issue 2511090](https://www.drupal.org/project/s3fs/issues/2511090) for more information.

**Issue 2:** Uploading files over 100MB through the Drupal file fields are still limited by the [Platform upload limitations](/platform-considerations#large-files).

___

## [Schema](https://www.drupal.org/project/schema)

**Issue**: The module doesn't work with the MySQL TIMESTAMP column type in our heartbeat table, which is part of how we maintain status around whether or not a site and its database is active. This is a [known bug](https://drupal.org/node/468644) in the schema module.

**Solution**: Set a variable to suppress the error, [shown here](http://drupalcode.org/project/schema.git/blob/08b02458694d186f8ab3bd0b24fbc738f9271108:/schema.module#l372). Setting the variable `schema_suppress_type_warnings` to **true** will do it. You can achieve that by adding the following line to `settings.php`:

```php:title=settings.php
$conf[‘schema_suppress_type_warnings’] = TRUE;
```

___

## [Simple OAuth / OAuth 2.0](https://www.drupal.org/project/simple_oauth)

**Issue**: The module requires a very specific set of permissions for the folder and the keys to be uploaded. Using Private or non-standard filepaths won't work. It is not possible to change these in LIVE or TEST environment.

**Solution**: You can try to patch the [permission check in the module](https://github.com/thephpleague/oauth2-server/blob/e184691ded987c00966e341ac09c46ceeae0b27f/src/CryptKey.php#L51). The alternative is to use off-site key management tools like [Lockr](https://www.drupal.org/project/lockr)
___

## [Taxonomy CSV](https://www.drupal.org/project/taxonomy_csv)

**Issue**:  This module requires the use of the `/tmp` directory. See [Using the tmp Directory](#using-the-tmp-directory) section below.
___

## [Twig Extensions](https://www.drupal.org/project/twig_extensions)

**Issue**:  This module uses [`php-intl`]( https://secure.php.net/manual/en/intro.intl.php), which is not currently supported by Pantheon.
___

## [Varnish](https://www.drupal.org/project/varnish)

**Issue**: Conflicts with the existing platform configuration.

**Solution**: Update Drupal performance settings to set the TTL and have the platform page cache serve requests. See [Pantheon's Global CDN](/global-cdn)
___

## [Views data export](https://www.drupal.org/project/views_data_export)

**Issue**: This module requires the use of the `/tmp` directory. See [Using the tmp Directory](#using-the-tmp-directory) below for more information.

**Solution**: A possible solution would be to set the export directory in `settings.php` to a `public://` stream wrapper location versus a `temporary://` one.  Example:

```php:title=settings.php
$conf['views_data_export_directory'] = 'public://';
```

or to a specific directory:

```php:title=settings.php
$conf['views_data_export_directory'] = 'public://vde/';
```

Additionally, the variable can be set using Drush:

```bash{promptUser: user}
drush vset views_data_export_directory 'public://'
```

Also see [Multiple Servers + Batch Database Stream Wrapper (sandbox module)](https://www.drupal.org/sandbox/jim/2352733).

___

<Partial file="tmp-directory.md" />

## Other Issues

Modules will not work on Pantheon if they:

- Require Apache.
- Require customized `.htaccess` files.
- Need to modify Nginx configuration files.
- Require PostgreSQL or other non-MySQL compatible databases.
