# AWS Instance Control Bot

Discord bot to start and stop AWS EC2 instances by name.

------------

### Usage
- `!aws start instance_name` / `!aws stop instance_name`

	Starts/stops the instance associated with that name.
    
- `!aws status instance_name`

    Replys with the current state of the instance (running, stopped, etc)

------------

### Setup
1. Copy `config.example.yml` to `config.yml` 
2. Replace the placeholder token.
3. Replace the example instances with AWS EC2 instance ids and their names.
4. `bundle install`
5. `bundle exec ruby main.rb`

------------

*Created by [detjensrobert](https://github.com/detjensrobert/aws-instances-bot) / @WholeWheatBagels#3140*
