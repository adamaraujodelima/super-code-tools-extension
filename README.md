# Super Code Tools Extension

This extension enables running PHP code analysis tools inside a Docker container. The extension integrates the following PHP tools:

- PHP Code Sniffer
- PHP Mess Detector
- PHPStan
- Psalm

You can configure which tools to enable or disable through the extension settings. This extension requires Docker to be installed and running on your machine.

## Features

- **PHP Code Sniffer**: Detects violations of a defined coding standard.
- **PHP Mess Detector**: Finds possible problems in your code.
- **PHPStan**: Performs static analysis of your PHP code.
- **Psalm**: A static analysis tool for finding errors in PHP applications.

## Requirements

- Docker must be installed and running on your machine.
- Visual Studio Code.

## Configuration

You can enable or disable the desired tools in the extension settings. To access the settings, go to:

`File` > `Preferences` > `Settings` > `Extensions` > `PHP Tools Docker`

The available settings are:

- **Enable PHP Code Sniffer**: Toggle to enable or disable PHP Code Sniffer.
- **Enable PHP Mess Detector**: Toggle to enable or disable PHP Mess Detector.
- **Enable PHPStan**: Toggle to enable or disable PHPStan.
- **Enable Psalm**: Toggle to enable or disable Psalm.

## Usage

1. Open a PHP project in Visual Studio Code.
2. Configure the extension settings to enable or disable the desired tools.
3. Save your changes.
4. The extension will automatically run the selected tools inside a Docker container and display the results in the Problems panel.

## Example Settings

Here is an example of how to configure the settings in your `settings.json` file:

```json
{
    "superCodeTools.phpcs": true,
    "superCodeTools.phpmd": true,
    "superCodeTools.phpstan": true,
    "superCodeTools.psalm": true
}
```

## Troubleshooting

If you encounter issues with the extension, ensure that:

- Docker is installed and running on your machine.
- You have the necessary permissions to run Docker commands.
- Your PHP project is correctly configured.

For further assistance, refer to the [Issues](https://github.com/adamaraujodelima/super-code-tools-extension/issues) section in the repository.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

For more information, visit the [GitHub repository](https://github.com/adamaraujodelima/super-code-tools-extension).

---

**Happy coding!**
